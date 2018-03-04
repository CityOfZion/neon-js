import { RPCResponse } from '../../rpc'
import { signingFunction, net } from './core';

/** Queries for NEP5 Token information. */
export function getTokenInfo(url: string, scriptHash: string): Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>

/** Get the token balance of Address from Contract */
export function getTokenBalance(url: string, scriptHash: string, address: string): Promise<number>

/** Get the token info and also balance if address is provided. */
export function getToken(url: string, scriptHash: string, address?: string): Promise<object>

/** Transfers NEP5 Tokens. */
export function doTransferToken(
  net: net,
  scriptHash: string,
  fromWif: string,
  toAddress: string,
  transferAmount: number,
  gasCost?: number,
  signingFunction?: signingFunction
): Promise<RPCResponse>
