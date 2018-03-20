import { Balance, Claims } from '../../wallet'
import { RPCResponse } from '../../rpc'
import { Fixed8 } from '../../utils'
import { signingFunction, net, AssetAmounts, PastTransaction } from './core';

/** API Switch for MainNet and TestNet */
export function getAPIEndpoint(net: net): string

/** Get balances of NEO and GAS for an address */
export function getBalance(net: net, address: string): Promise<Balance>

/** Get amounts of available (spent) and unavailable claims. */
export function getClaims(net: net, address: string): Promise<Claims>

/** Gets the maximum amount of gas claimable after spending all NEO. */
export function getMaxClaimAmount(net: net, address: string): Promise<Fixed8>

/** Returns the best performing (highest block + fastest) node RPC. */
export function getRPCEndpoint(net: net): Promise<string>

/** Get transaction history for an account */
export function getTransactionHistory(net: net, address: string): Promise<PastTransaction[]>

/** Get the current height of the light wallet DB */
export function getWalletDBHeight(net: net): Promise<number>

/** DEPRECATED: use claimGas instead */
export function doClaimAllGas(
  net: net,
  privateKey: string
): Promise<RPCResponse>

/** DEPRECATED: use claimGas instead */
export function doClaimAllGas(
  net: net,
  publicKey: string,
  signingFunction: signingFunction
): Promise<RPCResponse>

/** DEPRECATED: Call mintTokens for RPX */
export function doMintTokens(
  net: net,
  scriptHash: string,
  fromWif: string,
  neo: number,
  gasCost: number
): Promise<RPCResponse>

/** DEPRECATED: Call mintTokens for RPX */
export function doMintTokens(
  net: net,
  scriptHash: string,
  publicKey: string,
  neo: number,
  gasCost: number,
  signingFunction: signingFunction
): Promise<RPCResponse>

/** DEPRECATED: Send an asset to an address */
export function doSendAsset(
  net: net,
  toAddress: string,
  from: string,
  assetAmounts: AssetAmounts
): Promise<RPCResponse>

/** DEPRECATED: Send an asset to an address */
export function doSendAsset(
  net: net,
  toAddress: string,
  publicKey: string,
  assetAmounts: AssetAmounts,
  signingFunction: signingFunction
): Promise<RPCResponse>
