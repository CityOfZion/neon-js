import { Balance, Claims } from '../wallet'
import { Transaction, TransactionOutput } from '../transactions'
import { RPCResponse } from '../rpc'
import { Fixed8 } from '../utils'

export type net = 'MainNet' | 'TestNet' | string;
export type signingFunction = (unsigned: Transaction, publicKey: string) => Transaction

interface apiConfig {
  net: net
  address: string
  privateKey?: string
  publicKey?: string
  signingFunction?: signingFunction
  url?: string
  balance?: Balance
  response?: string
  intents?: TransactionOutput[]
}

interface AssetAmounts {
  GAS?: number
  NEO?: number
}

interface History {
  address: string
  history: PastTransaction[]
  name: string
  net: net
}

interface PastTransaction {
  GAS: number
  NEO: number
  block_index: number
  gas_sent: boolean
  neo_sent: boolean
  txid: string
}

interface Prices {
  [key: string]: number
}
//coinmarketcap
export namespace cmc {
  export function getPrice(coin?: string, currency?: string): Promise<number>
  export function getPrices(coin?: string[], currency?: string): Promise<Prices>
}


//core
export function getBalanceFrom(config: apiConfig, api: object): Promise<apiConfig>
export function getClaimsFrom(config: apiConfig, api: object): Promise<apiConfig>
export function getRPCEndpointFrom(config: apiConfig, api: object): Promise<string>
export function getTransactionHistoryFrom(config: apiConfig, api: object): Promise<History>
export function getWalletDBHeightFrom(config: apiConfig, api: object): Promise<number>
export function getMaxClaimAmountFrom(config: apiConfig, api: object): Promise<Fixed8>
export function createTx(config: apiConfig, txType: string): Promise<apiConfig>
export function signTx(config: apiConfig): Promise<apiConfig>
export function sendTx(config: apiConfig): Promise<apiConfig>
export function makeIntent(assetAmts: AssetAmounts, address: string): TransactionOutput[]
export function sendAsset(config: apiConfig): Promise<apiConfig>
export function claimGas(config: apiConfig): Promise<apiConfig>
export function doInvoke(config: apiConfig): Promise<apiConfig>
export function fillKeys(config: apiConfig): Promise<apiConfig>
export function fillBalance(config: apiConfig):Promise<apiConfig>

//neonDB
export namespace neonDB {
  export function getAPIEndpoint(net: net): string
  export function getBalance(net: net, address: string): Promise<Balance>
  export function getClaims(net: net, address: string): Promise<Claims>
  export function getRPCEndpoint(net: net): Promise<string>
  export function getTransactionHistory(net: net, address: string): Promise<History>
  export function getWalletDBHeight(net: net): Promise<number>

  export function doClaimAllGas(
    net: net,
    privateKey: string
  ): Promise<RPCResponse>
  export function doClaimAllGas(
    net: net,
    publicKey: string,
    signingFunction: signingFunction
  ): Promise<RPCResponse>

  export function doMintTokens(
    net: net,
    scriptHash: string,
    fromWif: string,
    neo: number,
    gasCost: number
  ): Promise<RPCResponse>
  export function doMintTokens(
    net: net,
    scriptHash: string,
    publicKey: string,
    neo: number,
    gasCost: number,
    signingFunction: signingFunction
  ): Promise<RPCResponse>

  export function doSendAsset(
    net: net,
    toAddress: string,
    from: string,
    assetAmounts: AssetAmounts
  ): Promise<RPCResponse>
  export function doSendAsset(
    net: net,
    toAddress: string,
    publicKey: string,
    assetAmounts: AssetAmounts,
    signingFunction: signingFunction
  ): Promise<RPCResponse>
}

//neoscan
export namespace neoscan {
  export function getAPIEndpoint(net: net): string
  export function getRPCEndpoint(net: net): Promise<string>
  export function getBalance(net: net, address: string): Promise<Balance>
  export function getClaims(net: net, address: string): Promise<Claims>
  export function getMaxClaimAmount(net: net, address: string): Promise<Fixed8>
  export function getWalletDBHeight(net: net): Promise<number>
  export function getTransactionHistory(net: net, address: string): Promise<History>
}

//nep5
export namespace nep5 {
  export function getTokenInfo(url: string, scriptHash: string): Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>
  export function getTokenBalance(url: string, scriptHash: string, address: string): Promise<number>
  export function getToken(url: string, scriptHash: string, address?: string): Promise<object>
  export function doTransferToken(
    net: net,
    scriptHash: string,
    fromWif: string,
    toAddress: string,
    transferAmount: number,
    gasCost?: number,
    signingFunction?: signingFunction
  ): Promise<RPCResponse>
}

// switch
export function setApiSwitch(newSetting: number): void
export function setSwitchFreeze(newSetting: boolean): void
