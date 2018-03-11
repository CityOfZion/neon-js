import { Fixed8 } from '../../utils';
import { Coin } from './Coin';

export interface AssetBalance {
  balance: number|Fixed8
  unspent: Coin[]
  spent: Coin[]
  unconfirmed: Coin[]
}

export function AssetBalance(assetBalance?: AssetBalance): AssetBalance
