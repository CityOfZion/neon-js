import { tx, u } from "@cityofzion/neon-core";
import { getVerificationSignatureForSmartContract } from "./common";
import { ManagedApiBasicConfig } from "./types";

/**
 * Adds the contractState to invocations sending from the contract's balance.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export async function addSignatureIfExecutingAsSmartContract(
  config: ManagedApiBasicConfig
): Promise<ManagedApiBasicConfig> {
  if (!config.sendingFromSmartContract) {
    return config;
  }
  const witness = await getVerificationSignatureForSmartContract(
    config.url!,
    config.sendingFromSmartContract
  );

  config.tx!.addWitness(witness);

  return config;
}
