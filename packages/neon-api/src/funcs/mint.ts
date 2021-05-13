/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { tx, u } from "@cityofzion/neon-core";
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
    const witness = await getVerificationSignatureForSmartContract(
      config.url!,
      config.script.scriptHash
    );
    config.tx!.addWitness(witness);
  }
  return config;
}
