import { Fixed8 } from '../../utils';

export interface Coin {
  index?: number
  txid?: string
  value?: number|Fixed8
}

export function Coin (coinObj: Coin): Coin;
