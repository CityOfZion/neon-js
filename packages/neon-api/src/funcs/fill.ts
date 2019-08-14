import { signWithPrivateKey } from "./sign";
import { ManagedApiBasicConfig } from "./types";

/**
 * Retrieves RPC endpoint URL of best available node
 * @param config
 * @return Configuration object with url field.
 */
export async function fillUrl(
  config: ManagedApiBasicConfig
): Promise<ManagedApiBasicConfig> {
  if (config.url) {
    return config;
  }
  config.url = await config.api.getRPCEndpoint();
  return config;
}

/**
 * Fills the signingFunction if no signingFunction provided.
 * The signingFunction filled is a privateKey signing function using the private key from the account field.
 * Throws an error if unable to find signingFunction and account.
 * @param config
 * @return Configuration object.
 */
export async function fillSigningFunction(
  config: ManagedApiBasicConfig
): Promise<ManagedApiBasicConfig> {
  if (!config.signingFunction) {
    if (config.account) {
      config.signingFunction = signWithPrivateKey(config.account.privateKey);
    } else {
      throw new Error("No account found!");
    }
  }
  return config;
}
