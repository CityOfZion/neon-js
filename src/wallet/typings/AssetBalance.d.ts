import { Fixed8 } from '../../utils';
import { Coin, CoinObj } from './Coin';

export interface AssetBalanceObj {
  balance: number
  unspent: CoinObj[]
  spent: CoinObj[]
  unconfirmed: CoinObj[]
}

export class AssetBalance {
  constructor(assetBalance?: AssetBalanceObj)

  balance: Fixed8
  unspent: Coin[]
  spent: Coin[]
  unconfirmed: Coin[]
}
