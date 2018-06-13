import { rpc, tx, u, wallet } from "@cityofzion/neon-core";
import { getVerificationSignatureForSmartContract } from "./common";
import { DoInvokeConfig } from "./types";

/**
 * Adds attributes to the override object for mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object.
 */
export async function addAttributeForMintToken(
  config: DoInvokeConfig
): Promise<DoInvokeConfig> {
  if (
    typeof config.script === "object" &&
    config.script.operation === "mintTokens" &&
    config.script.scriptHash
  ) {
    config.tx!.addAttribute(
      tx.TxAttrUsage.Script,
      u.reverseHex(config.script.scriptHash)
    );
  }
  return config;
}

/**
 * Adds the contractState to mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object.
 */
export async function addSignatureForMintToken(
  config: DoInvokeConfig
): Promise<DoInvokeConfig> {
  if (
    typeof config.script === "object" &&
    config.script.operation === "mintTokens" &&
    config.script.scriptHash
  ) {
    const verificationSignature = await getVerificationSignatureForSmartContract(
      config.url!,
      config.script.scriptHash
    );
    if (
      parseInt(config.script.scriptHash, 16) > parseInt(config.account!.scriptHash, 16)
    ) {
      config.tx!.scripts.push(verificationSignature);
    } else {
      config.tx!.scripts.unshift(verificationSignature);
    }
  }
  return config;
}
