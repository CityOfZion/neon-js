import { tx } from "@cityofzion/neon-core";
import { DoInvokeConfig } from "./types";
/**
 * Check that properties are defined in obj.
 * @param obj - Object to check.
 * @param props - List of properties to check.
 */
export declare function checkProperty<T, K extends keyof T>(obj: T, ...props: K[]): void;
/**
 * Adds the necessary attributes for validating an empty transaction.
 * @param config
 * @return
 */
export declare function modifyTransactionForEmptyTransaction(config: DoInvokeConfig): Promise<DoInvokeConfig>;
/**
 * Extracts fields for logging purposes. Removes any sensitive fields.
 * @param config Configuration object
 * @return object safe for logging
 */
export declare function extractDump<T>(config: T): Partial<T>;
/**
 * Returns a signature that can trigger verification for smart contract.
 * Must be combined with a Script attribute for full effect.
 * This signature requires some ordering within the array.
 * @param url RPC url
 * @param smartContractScriptHash The scripthash of the smart contract that you want to trigger verification for.
 * @return A signature object that can be attached to a Transaction.
 */
export declare function getVerificationSignatureForSmartContract(url: string, smartContractScriptHash: string): Promise<tx.Witness>;
//# sourceMappingURL=common.d.ts.map