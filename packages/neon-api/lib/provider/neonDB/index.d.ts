import { u, wallet } from "@cityofzion/neon-core";
import { PastTransaction } from "../common";
export declare const name = "neonDB";
/**
 * Returns the appropriate neonDB endpoint.
 * @param net Name of network to retrieve the endpoint from. Alternatively, provide a custom url.
 * @return URL of API endpoint.
 */
export declare function getAPIEndpoint(net: string): string;
/**
 * Returns an appropriate RPC endpoint retrieved from a neonDB endpoint.
 * @param net 'MainNet', 'TestNet' or a custom neonDB-like url.
 * @returns URL of a good RPC endpoint.
 */
export declare function getRPCEndpoint(net: string): Promise<string>;
/**
 * Get balances of NEO and GAS for an address
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return  Balance of address
 */
export declare function getBalance(net: string, address: string): Promise<wallet.Balance>;
/**
 * Get amounts of available (spent) and unavailable claims.
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return An object with available and unavailable GAS amounts.
 */
export declare function getClaims(net: string, address: string): Promise<wallet.Claims>;
/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return An object with available and unavailable GAS amounts.
 */
export declare function getMaxClaimAmount(net: string, address: string): Promise<u.Fixed8>;
/**
 * Get transaction history for an account
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return a list of PastTransaction
 */
export declare function getTransactionHistory(net: string, address: string): Promise<PastTransaction[]>;
/**
 * Get the current height of the light wallet DB
 * @param net - 'MainNet' or 'TestNet'.
 * @return Current height.
 */
export declare const getHeight: (net: string) => Promise<number>;
//# sourceMappingURL=index.d.ts.map