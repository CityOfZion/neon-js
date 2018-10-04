import { tx, u } from "@cityofzion/neon-core";
import { getVerificationSignatureForSmartContract } from "./common";
import { ManagedApiBasicConfig } from "./types";

/**
 * Adds attributes to the override object for mintTokens invocations.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export async function addAttributeIfExecutingAsSmartContract<
  T extends ManagedApiBasicConfig<tx.BaseTransaction>
>(config: T): Promise<T> {
  if (!config.sendingFromSmartContract) {
    return config;
  }
  config.tx!.addAttribute(
    tx.TxAttrUsage.Script,
    u.reverseHex(config.sendingFromSmartContract)
  );
  return config;
}

/**
 * Adds the contractState to invocations sending from the contract's balance.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export async function addSignatureIfExecutingAsSmartContract<
  T extends ManagedApiBasicConfig<tx.BaseTransaction>
>(config: T): Promise<T> {
  if (!config.sendingFromSmartContract) {
    return config;
  }
  const verificationSignature = await getVerificationSignatureForSmartContract(
    config.url!,
    config.sendingFromSmartContract
  );

  // We need to order this for the VM.
  const acct = config.account!;
  if (
    parseInt(config.sendingFromSmartContract, 16) >
    parseInt(acct.scriptHash, 16)
  ) {
    config.tx!.scripts.push(verificationSignature);
  } else {
    config.tx!.scripts.unshift(verificationSignature);
  }

  return config;
}
