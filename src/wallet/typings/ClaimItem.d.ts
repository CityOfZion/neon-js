import { Fixed8 } from '../../utils';

export class ClaimItemLike {
  claim?: number;
  txid?: string;
  index?: number;
  value?: number;
  start?: number;
  end?: number;
}

export class ClaimItem {
  constructor(claims?: ClaimItemLike)

  claim: Fixed8;
  txid: string;
  index: number;
  value: number;
  start?: number;
  end?: number;

  export(): ClaimItemLike
}
