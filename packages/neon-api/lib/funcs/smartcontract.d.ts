import { tx } from "@cityofzion/neon-core";
import { ManagedApiBasicConfig } from "./types";
/**
 * Adds attributes to the override object for mintTokens invocations.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export declare function addAttributeIfExecutingAsSmartContract<T extends ManagedApiBasicConfig<tx.BaseTransaction>>(config: T): Promise<T>;
/**
 * Adds the contractState to invocations sending from the contract's balance.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export declare function addSignatureIfExecutingAsSmartContract<T extends ManagedApiBasicConfig<tx.BaseTransaction>>(config: T): Promise<T>;
//# sourceMappingURL=smartcontract.d.ts.map