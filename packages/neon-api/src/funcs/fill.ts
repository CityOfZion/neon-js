import { wallet } from "@cityofzion/neon-core";
import { signWithPrivateKey } from "./sign";
import {
  ClaimGasConfig,
  DoInvokeConfig,
  ManagedApiBasicConfig,
  SendAssetConfig
} from "./types";

/**
 * Retrieves RPC endpoint URL of best available node
 * @param config
 * @return Configuration object with url field.
 */
export async function fillUrl<T extends ManagedApiBasicConfig>(
  config: T
): Promise<T> {
  if (config.url) {
    return config;
  }
  config.url = await config.api.getRPCEndpoint(config.net);
  return config;
}

/**
 * Retrieves Balance if no balance has been attached
 * @param config
 * @return Configuration object.
 */
export async function fillBalance<T extends DoInvokeConfig | SendAssetConfig>(
  config: T
): Promise<T> {
  if (!(config.balance instanceof wallet.Balance)) {
    config.balance = await config.api.getBalance(
      config.net,
      config.account!.address
    );
  }
  return config;
}

/**
 * Fills the relevant key fields if account has been attached.
 * @param config
 * @return Configuration object.
 */
export async function fillAccount<T extends ManagedApiBasicConfig>(
  config: T
): Promise<T> {
  if (!config.account) {
    if (config.privateKey) {
      config.account = new wallet.Account(config.privateKey);
    } else if (config.publicKey) {
      config.account = new wallet.Account(config.publicKey);
    } else if (config.address) {
      config.account = new wallet.Account(config.address);
    } else {
      throw new Error("No identifying key found!");
    }
  }
  return config;
}

/**
 * Fills the signingFunction if no signingFunction provided.
 * The signingFunction filled is a privateKey signing function using the private key from the account field.
 * Throws an error if unable to find signingFunction and account.
 * @param config
 * @return Configuration object.
 */
export async function fillSigningFunction<T extends ManagedApiBasicConfig>(
  config: T
): Promise<T> {
  if (!config.signingFunction) {
    if (config.account) {
      config.signingFunction = signWithPrivateKey(config.account.privateKey);
    } else {
      throw new Error("No account found!");
    }
  }
  return config;
}

/**
 * Retrieves Claims if no claims has been attached.
 * @param config
 * @return Configuration object.
 */
export async function fillClaims(
  config: ClaimGasConfig
): Promise<ClaimGasConfig> {
  if (!(config.claims instanceof wallet.Claims)) {
    config.claims = await config.api.getClaims(
      config.net,
      config.account!.address
    );
  }
  return config;
}
