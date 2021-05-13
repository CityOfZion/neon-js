/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { tx, wallet } from "@cityofzion/neon-core";
import { signWithPrivateKey } from "./sign";
import {
  ClaimGasConfig,
  DoInvokeConfig,
  ManagedApiBasicConfig,
  SendAssetConfig,
} from "./types";

/**
 * Retrieves RPC endpoint URL of best available node
 * @param config
 * @return Configuration object with url field.
 */
export async function fillUrl<
  U extends tx.BaseTransaction,
  T extends ManagedApiBasicConfig<U>
>(config: T): Promise<T> {
  if (config.url) {
    return config;
  }
  config.url = await config.api.getRPCEndpoint();
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
    config.balance = await config.api.getBalance(config.account!.address);
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
export async function fillSigningFunction<
  U extends tx.BaseTransaction,
  T extends ManagedApiBasicConfig<U>
>(config: T): Promise<T> {
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
export async function fillClaims<
  U extends tx.BaseTransaction,
  _T extends ManagedApiBasicConfig<U>
>(config: ClaimGasConfig): Promise<ClaimGasConfig> {
  if (!(config.claims instanceof wallet.Claims)) {
    config.claims = await config.api.getClaims(config.account!.address);
  }
  if (!config.claims.claims || config.claims.claims.length === 0) {
    throw new Error(`No Claims found`);
  }
  return config;
}
