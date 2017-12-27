///<reference path="../rpc/index.d.ts" />
///<reference path="../transactions/index.d.ts" />

declare module '@cityofzion/neon-js' {
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
    net: 'MainNet' | 'TestNet'
  }

  interface PastTransaction {
    GAS: number
    NEO: number
    block_index: number
    gas_sent: boolean
    neo_sent: boolean
    txid: string
  }

  export module api {
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
    export function makeIntent(assetAmts: AssetAmounts, address: string): TransactionOutput[]
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
        assetAmounts: AssetAmounts
      ): Promise<RPCResponse>
      export function doSendAsset(
        net: string,
        toAddress: string,
        publicKey: string,
        assetAmounts: AssetAmounts,
        signingFunction: (unsigned: Transaction, publicKey: string) => Transaction
      ): Promise<RPCResponse>
    }

    //neoscan
    export namespace neoscan {
      export function getAPIEndpoint(net: string): string
      export function getRPCEndpoint(net: string): Promise<string>
      export function getBalance(net: string, address: string): Promise<Balance>
      export function getClaims(net: string, address: string): Promise<Claim>
    }

    //nep5
    export namespace nep5 {
      export function getTokenInfo(url: string, scriptHash: string): Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>
      export function getTokenBalance(url: string, scriptHash: string, address: string): Promise<number>
      export function getToken(url: string, scriptHash: string, address?: string): Promise<object>
      export function doTransferToken(
        net: string,
        scriptHash: string,
        fromWif: string,
        toAddress: string,
        transferAmount: number,
        gasCost?: number,
        signingFunction?: (unsigned: Transaction, publicKey: string) => Transaction
      ): Promise<RPCResponse>
    }
  }
  export interface semantic {
    get: {
      price: (coin?: string, currency?: string) => Promise<number>
      prices: (coins?: Array<string>, currency?: string) => Promise<object>
      balance: (net: string, address: string) => Promise<Balance>
      claims: (net: string, address: string) => Promise<Claim>
      transactionHistory: (net: string, address: string) => Promise<History>
      tokenBalance: (net: string, scriptHash: string) => Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>
      tokenInfo: (net: string, scriptHash: string) => Promise<{ name: string, symbol: string, decimals: number, totalSupply: number }>
    },
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
  }
}
