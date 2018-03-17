import { Balance, Claims } from '../../wallet'
import { Fixed8 } from '../../utils'
import { net, PastTransaction } from './core';

/** Returns the appropriate NeoScan endpoint. */
export function getAPIEndpoint(net: net): string

/** Returns an appropriate RPC endpoint retrieved from a NeoScan endpoint. */
export function getRPCEndpoint(net: net): Promise<string>

/** Gat balances for an address. */
export function getBalance(net: net, address: string): Promise<Balance>

/** Get claimable amounts for an address. */
export function getClaims(net: net, address: string): Promise<Claims>

/** Gets the maximum amount of gas claimable after spending all NEO. */
export function getMaxClaimAmount(net: net, address: string): Promise<Fixed8>

/** Get the current height of the light wallet DB */
export function getWalletDBHeight(net: net): Promise<number>

/** Get transaction history for an account */
export function getTransactionHistory(net: net, address: string): Promise<PastTransaction[]>
