import { u, wallet } from "@cityofzion/neon-core";
export declare const name = "neoscan";
/**
 * Returns the appropriate NeoScan endpoint.
 * @param net Name of network to retrieve the endpoint from. Alternatively, provide a custom url.
 */
export declare function getAPIEndpoint(net: string): string;
/**
 * Returns an appropriate RPC endpoint retrieved from a NeoScan endpoint.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @returns URL of a good RPC endpoint.
 */
export declare function getRPCEndpoint(net: string): Promise<string>;
/**
 * Gets balance for an address. Returns an empty Balance if endpoint returns not found.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address Address to check.
 * @return Balance of address retrieved from endpoint.
 */
export declare function getBalance(net: string, address: string): Promise<wallet.Balance>;
/**
 * Get claimable amounts for an address. Returns an empty Claims if endpoint returns not found.
 * @param net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address - Address to check.
 * @return Claims retrieved from endpoint.
 */
export declare function getClaims(net: string, address: string): Promise<wallet.Claims>;
/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address Address to check.
 * @return
 */
export declare function getMaxClaimAmount(net: string, address: string): Promise<u.Fixed8>;
/**
 * Get the current height of the light wallet DB
 * @param net 'MainNet' or 'TestNet'.
 * @return  Current height as reported by provider
 */
export declare function getHeight(net: string): Promise<u.Fixed8>;
/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} A listof PastTransactionPastTransaction[]
 */
export declare function getTransactionHistory(net: string, address: string): Promise<{
    txid: string;
    blockHeight: u.Fixed8;
    change: {
        NEO: u.Fixed8;
        GAS: u.Fixed8;
    };
}[]>;
