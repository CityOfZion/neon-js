import { Balance, Claims } from '../../wallet'
import { RPCResponse } from '../../rpc'
import { Fixed8 } from '../../utils'
import { Transaction, TransactionOutput } from '../../transactions'

export type net = 'MainNet' | 'TestNet' | string;
export type signingFunction = (unsigned: Transaction, publicKey: string) => Transaction

export interface AssetAmounts {
  GAS?: number
  NEO?: number
}

export interface PastTransaction {
  change: {
    [assetSymbol: string]: Fixed8
  }
  blockHeight: Fixed8
  txid: string
}

export interface apiConfig {
  net: net
  address?: string
  privateKey?: string
  publicKey?: string
  signingFunction?: signingFunction
  url?: string
  balance?: Balance
  response?: string
  intents?: TransactionOutput[]
  sendingFromSmartContract?: boolean
  tx?: Transaction
  claims?: Claims
  script?: string
  gas?: number
  account?: Account
  override?: object
}

/** Function to construct and execute a ContractTransaction. */
export function sendAsset(config: apiConfig): Promise<apiConfig>

/** Perform a ClaimTransaction for all available GAS based on API */
export function claimGas(config: apiConfig): Promise<apiConfig>

/**Perform a InvocationTransaction based on config given */
export function doInvoke(config: apiConfig): Promise<apiConfig>

/** Retrieves RPC endpoint URL of best available node */
export function fillUrl(config: apiConfig): Promise<apiConfig>

/** Retrieves Balance if no balance has been attached */
export function fillBalance(config: apiConfig):Promise<apiConfig>

/** Fills the relevant key fields if account has been attached. */
export function fillKeys(config: apiConfig): Promise<apiConfig>

/** Creates a transaction with the given config and txType. */
export function createTx(config: apiConfig, txType: string): Promise<apiConfig>

/** Signs a transaction within the config object. */
export function signTx(config: apiConfig): Promise<apiConfig>

/** Sends a transaction off within the config object. */
export function sendTx(config: apiConfig): Promise<apiConfig>

/** Helper method to convert a AssetAmounts object to intents (TransactionOutput[]). */
export function makeIntent(assetAmts: AssetAmounts, address: string): TransactionOutput[]

/** Helper method to retrieve balance and URL from an endpoint. If URL is provided, it is not overriden. */
export function getBalanceFrom(config: apiConfig, api: object): Promise<apiConfig>

/** Helper method to retrieve claims and URL from an endpoint. */
export function getClaimsFrom(config: apiConfig, api: object): Promise<apiConfig>

/** Helper method to returns an appropriate RPC endpoint retrieved from an endpoint. */
export function getRPCEndpointFrom(config: apiConfig, api: object): Promise<string>

/** Helper method to get transaction history for an account */
export function getTransactionHistoryFrom(config: apiConfig, api: object): Promise<PastTransaction[]>

/** Helper method to get the current height of the light wallet DB */
export function getWalletDBHeightFrom(config: apiConfig, api: object): Promise<number>

/** Helper method to get the maximum amount of gas claimable after spending all NEO. */
export function getMaxClaimAmountFrom(config: apiConfig, api: object): Promise<Fixed8>
