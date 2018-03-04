import { Fixed8 } from '../../utils';

export interface CoinObj {
  index: number
  txid: string
  value: number
}

export class Coin {
  constructor(coinObj: CoinObj)

  index: number;
  txid: string;
  value: Fixed8;
}
