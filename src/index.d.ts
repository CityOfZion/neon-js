import { scriptParams } from './sc'
import { TransactionAttribute, TransactionInput, TransactionOutput } from './transactions'
import { apiConfig, AssetAmounts } from './api'
import { RPCRequest, RPCResponse } from './rpc'

import * as api from './api'
import * as CONST from './consts'
import * as rpc from './rpc'
import * as sc from './sc'
import * as tx from './transactions'
import * as wallet from './wallet'
import * as u from './utils'

export { api, CONST, rpc, sc, tx, wallet, u }


declare const semantic: {
  create: {
    account: (k: any) => Account
    privateKey: () => string
    signature: (tx: string, privateKey: string) => string
    wallet: (k: any) => wallet.Wallet,
    contractParam: (args: any) => sc.ContractParam
    script: ({ scriptHash, operation, args, useTailCall }: scriptParams) => string
    scriptBuilder: (args: any) => sc.ScriptBuilder
    deployScript: (args: any) => string
    rpcClient: (net: string) => rpc.RPCClient
    query: (req: RPCRequest) => rpc.Query
    tx: (args: any[]) => tx.Transaction
    claimTx: (publicKeyOrAddress: string, claimData: wallet.Claims, override: object) => tx.Transaction
    contractTx: (balances: wallet.Balance, intents: TransactionOutput[], override: object) => tx.Transaction
    invocationTx: (balance: wallet.Balance, intents: TransactionOutput[], invoke: object | string, gasCost: number, override: object) => tx.Transaction
  }
  is: {
    address: (address: string) => boolean
    publicKey: (key: string, encode?: boolean) => boolean
    encryptedKey: (nep2: string) => boolean
    privateKey: (key: string) => boolean
    wif: (wif: string) => boolean
    scriptHash: (scriptHash: string) => boolean
  }
  encrypt: {
    privateKey: (wifKey: string, keyphrase: string) => string
  }
  decrypt: {
    privateKey: (encryptedKey: string, keyphrase: string) => string
  }
  get: {
    privateKeyFromWIF: (wif: string) => string
    WIFFromPrivateKey: (privateKey: string) => string
    publicKeyFromPrivateKey: (publicKey: string, encode?: boolean) => string
    scriptHashFromPublicKey: (publicKey: string) => string
    addressFromScriptHash: (scriptHash: string) => string
    scriptHashFromAddress: (address: string) => string
    price: (coin?: string, currency?: string) => Promise<number>
    prices: (coins?: string[], currency?: string) => Promise<object>
    balance: (net: string, address: string) => Promise<wallet.Balance>
    claims: (net: string, address: string) => Promise<wallet.Claims>
    transactionHistory: (net: string, address: string) => Promise<History>
    tokenBalance: (net: string, scriptHash: string) => Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>
    tokenInfo: (net: string, scriptHash: string) => Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>
    transactionHash: (transaction: tx.Transaction) => string
  }
  serialize: {
    attribute: (attr: TransactionAttribute) => string
    input: (input: TransactionInput) => string
    output: (output: TransactionOutput) => string
    exclusiveData: object
    tx: (tx: tx.Transaction) => string
  }
  deserialize: {
    attribute: (stream: u.StringStream) => TransactionAttribute
    input: (stream: u.StringStream) => TransactionInput
    output: (stream: u.StringStream) => TransactionOutput
    exclusiveData: object
    tx: (stream: u.StringStream) => tx.Transaction
  }
  sign: {
    transaction: (transaction: tx.Transaction, privateKey: string) => tx.Transaction
  }
  do: {
    sendAsset: (
      net: string,
      toAddress: string,
      from: string,
      assetAmounts: AssetAmounts
    ) => Promise<RPCResponse>
    claimAllGas: (
      net: string,
      privateKey: string
    ) => Promise<RPCResponse>
    mintTokens: (
      net: string,
      scriptHash: string,
      fromWif: string,
      neo: number,
      gasCost: number
    ) => Promise<RPCResponse>
  }
  sendAsset: (config: apiConfig) => Promise<apiConfig>
  claimGas: (config: apiConfig) => Promise<apiConfig>
  doInvoke: (config: apiConfig) => Promise<apiConfig>
}

export default semantic;

export as namespace Neon;
