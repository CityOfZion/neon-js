import { tx } from "@cityofzion/neon-core";
import { DoInvokeConfig, ManagedApiBasicConfig, SendAssetConfig } from "./types";
/**
 * Sends a transaction off within the config object.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object + response
 */
export declare function sendTx<T extends ManagedApiBasicConfig<tx.BaseTransaction>>(config: T): Promise<T>;
export declare function applyTxToBalance<T extends DoInvokeConfig | SendAssetConfig>(config: T): Promise<T>;
//# sourceMappingURL=send.d.ts.map