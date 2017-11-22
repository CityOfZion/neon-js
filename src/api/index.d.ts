import { RPCResponse } from "../rpc/index";


interface apiConfig {
  net: string,
  address: string,
  privateKey?: string,
  publicKey?: string,
  url?: string,
  balance?: Balance
}

interface AssetAmounts {
  GAS: number
  NEO: number
}

interface History {
  address: string
  history: PastTransaction[]
  name: string
  net: Net
}

interface PastTransaction {
  GAS: number
  NEO: number
  block_index: number
  gas_sent: boolean
  neo_sent: boolean
  txid: string
}

//coinmarketcap
export namespace cmc {
  export function getPrice(coin?: string, currency?: string): Promise<number>
}


//core
export function getBalanceFrom(config: apiConfig, api: object): apiConfig
export function getClaimsFrom(config: apiConfig, api: object): apiConfig
export function createTx(config: apiConfig, txType: string): apiConfig
export function signTx(config: apiConfig): apiConfig
export function sendTx(config: apiConfig): apiConfig
export function makeIntent(assetAmts: assetAmounts, address: string): TransactionOutput[]
export function sendAsset(config: apiConfig): apiConfig
export function claimGas(config: apiConfig): apiConfig
export function doInvoke(config: apiConfig): apiConfig

//neonDB
export namespace neonDB {
  export function getAPIEndpoint(net: string): string
  export function getBalance(net: string, address: string): Promise<Balance>
  export function getClaims(net: string, address: string): Promise<Claim>
  export function getRPCEndpoint(net: string): Promise<string>
  export function getTransactionHistory(net: string, address: string): Promise<History>
  export function getWalletDBHeight(net: string): Promise<number>

  export function doClaimAllGas(
    net: string,
    privateKey: string
  ): Promise<RPCResponse>
  export function doClaimAllGas(
    net: string,
    publicKey: string,
    signingFunction: (unsigned: Transaction, publicKey: string) => Transaction
  ): Promise<RPCResponse>

  export function doMintTokens(
    net: string,
    scriptHash: string,
    fromWif: string,
    neo: number,
    gasCost: number
  ): Promise<RPCResponse>
  export function doMintTokens(
    net: string,
    scriptHash: string,
    publicKey: string,
    neo: number,
    gasCost: number,
    signingFunction: (unsigned: Transaction, publicKey: string) => Transaction
  ): Promise<RPCResponse>

  export function doSendAsset(
    net: string,
    toAddress: string,
    from: string,
    assetAmounts: assetAmounts
  ): Promise<RPCResponse>
  export function doSendAsset(
    net: string,
    toAddress: string,
    publicKey: string,
    assetAmounts: assetAmounts,
    signingFunction: (unsigned: Transaction, publicKey: string) => Transaction
  ): Promise<RPCResponse>
}

//neoscan
export namespace neoscan {
  export function getAPIEndpoint(net: string): string
  export function getRPCEndpoint(net: string): Promise<string>
  export function getBalance(net: string, address: string): Promise<Balance>
  export function getClaims(net: string, address: string): Promise<Claims>
}

//nep5
export namespace nep5 {
  export function getTokenInfo(net: string, scriptHash: string): Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>
  export function getTokenBalance(net: string, scriptHash: string, address: string): Promise<number>
}

//index
export default {
  get: {
    price: cmc.getPrice,
    balance: neonDB.getBalance,
    claims: neonDB.getClaims,
    transactionHistory: neonDB.getTransactionHistory,
    tokenBalance: nep5.getTokenBalance,
    tokenInfo: nep5.getTokenInfo
  },
  do: {
    sendAsset: neonDB.doSendAsset,
    claimAllGas: neonDB.doClaimAllGas,
    mintTokens: neonDB.doMintTokens
  }
}
