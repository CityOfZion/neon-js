import { wallet } from "@cityofzion/neon-core";
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
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Balance>} Balance of address
 */
export declare function getBalance(net: string, address: string): Promise<wallet.Balance>;
/**
 * Get amounts of available (spent) and unavailable claims.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Claim>} An object with available and unavailable GAS amounts.
 */
export declare function getClaims(net: string, address: string): Promise<wallet.Claims>;
/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Fixed8>} An object with available and unavailable GAS amounts.
 */
export declare const getMaxClaimAmount: (net: any, address: any) => Promise<any>;
/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} a list of PastTransaction
 */
export declare const getTransactionHistory: (net: any, address: any) => Promise<any>;
/**
 * Get the current height of the light wallet DB
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<number>} Current height.
 */
export declare const getWalletDBHeight: (net: any) => Promise<number>;
