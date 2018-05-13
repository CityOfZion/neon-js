import { Fixed8 } from '../../utils';
import { Transaction } from '../../transactions/index'
import { AssetBalance } from './AssetBalance';
import { net } from '../../api/typings/core'

export interface BalanceLike {
  net: net;
  address: string;
  assetSymbols:  string[];
  assets: { [index: string]: AssetBalance };
  tokenSymbols: string[];
  tokens: { [index: string]: number };
}

/** Describes the coins found within an Account. Look up various balances through its symbol. For example, NEO or GAS. */
export class Balance {
  constructor(bal?: BalanceLike)

  /** The address for this Balance */
  address: string

  /** The network for this Balance */
  net: net

  /** The symbols of assets found in this Balance. Use this symbol to find the corresponding key in the assets object. */
  assetSymbols: string[]

  /** The object containing the balances for each asset keyed by its symbol. */
  assets: { [index: string]: AssetBalance }

  /** The symbols of the NEP5 tokens in this Balance. Use this symbol to find the corresponding key in the tokens object. */
  tokenSymbols: string[]

  /** The token balances in this Balance for each token keyed by its symbol. */
  tokens: { [index: string]: number }

  /** Imports a string */
  static import(jsonString: string): Balance

  /** Adds a new asset to this Balance. */
  addAsset(sym: string, assetBalance?: AssetBalance): this

  /** Adds a new NEP-5 Token to this Balance. */
  addToken(sym: string, tokenBalance?: number | Fixed8): this

  /** Applies a Transaction to a Balance, removing spent coins and adding new coins. This currently applies only to Assets. */
  applyTx(tx: Transaction, confirmed?: boolean): this

  /** Export this class as a plain JS object */
  export(): BalanceLike

  /** Verifies the coins in balance are unspent. This is an expensive call. */
  verifyAssets(url: string): Promise<Balance>
}
