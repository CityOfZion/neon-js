import { Fixed8 } from '../../utils';
import { CoinObj } from './Coin';

export interface AssetBalanceObj {
  balance: number|Fixed8
  unspent: CoinObj[]
  spent: CoinObj[]
  unconfirmed: CoinObj[]
}

export function AssetBalance(assetBalance?: AssetBalanceObj): AssetBalanceObj
