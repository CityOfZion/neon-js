import { Fixed8 } from '../../utils';

export interface CoinObj {
  index: number
  txid: string
  value: number|Fixed8
}

export function Coin (coinObj: CoinObj): CoinObj;
