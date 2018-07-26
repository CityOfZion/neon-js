import { tx } from "@cityofzion/neon-core";
import { ManagedApiBasicConfig } from "./types";
/**
 * Signs a transaction within the config object.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export declare function signTx<T extends ManagedApiBasicConfig<tx.BaseTransaction>>(config: T): Promise<T>;
export declare function signWithPrivateKey(privateKey: string): (tx: string, publicKey: string) => Promise<string | string[]>;
//# sourceMappingURL=sign.d.ts.map