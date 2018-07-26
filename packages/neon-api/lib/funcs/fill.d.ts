import { tx } from "@cityofzion/neon-core";
import { ClaimGasConfig, DoInvokeConfig, ManagedApiBasicConfig, SendAssetConfig } from "./types";
/**
 * Retrieves RPC endpoint URL of best available node
 * @param config
 * @return Configuration object with url field.
 */
export declare function fillUrl<U extends tx.BaseTransaction, T extends ManagedApiBasicConfig<U>>(config: T): Promise<T>;
/**
 * Retrieves Balance if no balance has been attached
 * @param config
 * @return Configuration object.
 */
export declare function fillBalance<T extends DoInvokeConfig | SendAssetConfig>(config: T): Promise<T>;
/**
 * Fills the relevant key fields if account has been attached.
 * @param config
 * @return Configuration object.
 */
export declare function fillAccount<U extends tx.BaseTransaction, T extends ManagedApiBasicConfig<U>>(config: T): Promise<T>;
/**
 * Fills the signingFunction if no signingFunction provided.
 * The signingFunction filled is a privateKey signing function using the private key from the account field.
 * Throws an error if unable to find signingFunction and account.
 * @param config
 * @return Configuration object.
 */
export declare function fillSigningFunction<U extends tx.BaseTransaction, T extends ManagedApiBasicConfig<U>>(config: T): Promise<T>;
/**
 * Retrieves Claims if no claims has been attached.
 * @param config
 * @return Configuration object.
 */
export declare function fillClaims(config: ClaimGasConfig): Promise<ClaimGasConfig>;
//# sourceMappingURL=fill.d.ts.map