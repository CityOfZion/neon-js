import { tx } from "@cityofzion/neon-core";
import { ClaimGasConfig, DoInvokeConfig, SendAssetConfig } from "./types";
/**
 * The core API methods are series of methods defined to aid conducting core functionality while making it easy to modify any parts of it.
 * The core functionality are sendAsset, claimGas and doInvoke.
 * These methods are designed to be modular in nature and intended for developers to create their own custom methods.
 * The methods revolve around a configuration object in which everything is placed. Each method will take in the configuration object, check for its required fields and perform its operations, adding its results to the configuration object and returning it.
 * For example, the getBalanceFrom function requires net and address fields and appends the url and balance fields to the object.
 */
/**
 * Function to construct and execute a ContractTransaction.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export declare function sendAsset(config: SendAssetConfig): Promise<SendAssetConfig>;
/**
 * Perform a ClaimTransaction for all available GAS based on API
 * @param config - Configuration object.
 * @return Configuration object.
 */
export declare function claimGas(config: ClaimGasConfig): Promise<ClaimGasConfig>;
/**
 * Perform a InvocationTransaction based on config given.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export declare function doInvoke(config: DoInvokeConfig): Promise<DoInvokeConfig>;
export declare function makeIntent(assetAmts: {
    [k: string]: number;
}, address: string): tx.TransactionOutput[];
//# sourceMappingURL=main.d.ts.map