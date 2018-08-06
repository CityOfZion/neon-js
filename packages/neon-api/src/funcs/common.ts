import { rpc, tx, u, wallet } from "@cityofzion/neon-core";
import { DoInvokeConfig } from "./types";

/**
 * Check that properties are defined in obj.
 * @param obj - Object to check.
 * @param props - List of properties to check.
 */
export function checkProperty<T, K extends keyof T>(obj: T, ...props: K[]) {
  for (const prop of props) {
    if (
      !obj.hasOwnProperty(prop) ||
      obj[prop] === null ||
      obj[prop] === undefined
    ) {
      throw new ReferenceError(`Property not found: ${prop}`);
    }
  }
}

/**
 * Adds the necessary attributes for validating an empty transaction.
 * @param config
 * @return
 */
export async function modifyTransactionForEmptyTransaction(
  config: DoInvokeConfig
): Promise<DoInvokeConfig> {
  if (config.tx!.inputs.length === 0 && config.tx!.outputs.length === 0) {
    config.tx!.addAttribute(
      tx.TxAttrUsage.Script,
      u.reverseHex(wallet.getScriptHashFromAddress(config.account!.address))
    );
    // This adds some random bits to the transaction to prevent any hash collision.
    config.tx!.addRemark(
      Date.now().toString() + u.ab2hexstring(u.generateRandomArray(4))
    );
  }
  return config;
}

const sensitiveFields = ["privateKey"];
/**
 * Extracts fields for logging purposes. Removes any sensitive fields.
 * @param config Configuration object
 * @return object safe for logging
 */
export function extractDump<T>(config: T): Partial<T> {
  const dump = Object.assign({}, config);
  for (const key of Object.keys(config)) {
    if (sensitiveFields.indexOf(key) >= 0) {
      delete (dump as any)[key];
    }
  }
  return dump;
}

/**
 * Returns a signature that can trigger verification for smart contract.
 * Must be combined with a Script attribute for full effect.
 * This signature requires some ordering within the array.
 * @param url RPC url
 * @param smartContractScriptHash The scripthash of the smart contract that you want to trigger verification for.
 * @return A signature object that can be attached to a Transaction.
 */
export async function getVerificationSignatureForSmartContract(
  url: string,
  smartContractScriptHash: string
): Promise<tx.Witness> {
  const contractState = await rpc.Query.getContractState(
    smartContractScriptHash
  ).execute(url);
  const { parameters } = contractState.result;
  return {
    invocationScript: "00".repeat(parameters.length),
    verificationScript: ""
  } as tx.Witness;
}
