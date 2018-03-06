import { Fixed8 } from '../../utils';

export interface ClaimItemLike {
  claim?: number;
  txid?: string;
  index?: number;
  value?: number;
  start?: number;
  end?: number;
}

export interface ClaimItem {
  claim: Fixed8;
  txid: string;
  index: number;
  value: number;
  start?: Fixed8;
  end?: Fixed8;
}

export function ClaimItem(claimItem: ClaimItemLike): ClaimItem

export function exportClaimItem(claimItem: ClaimItem): ClaimItemLike
