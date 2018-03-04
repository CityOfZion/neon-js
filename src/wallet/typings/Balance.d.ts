import { Fixed8 } from '../../utils';
import { Transaction } from '../../transactions/index'
import { AssetBalanceObj } from './AssetBalance';

export class Balance {
  constructor(bal?: Balance)

  address: string
  net: 'MainNet' | 'TestNet'
  assetSymbols: string[]
  assets: { [index: string]: AssetBalanceObj }
  tokenSymbols: string[]
  tokens: { [index: string]: number }

  static import(jsonString: string): Balance

  addAsset(sym: string, assetBalance?: AssetBalanceObj): this
  addToken(sym: string, tokenBalance?: number | Fixed8): this
  applyTx(tx: Transaction, confirmed?: boolean): this
  export(): string
  verifyAssets(url: string): Promise<Balance>
}
