import { Fixed8 } from '../../utils';

export function ClaimItem (config: ClaimItemObj): ClaimItemObj;

export function exportClaimItem(claimItem: ClaimItemObj): ClaimItemObj;

export interface ClaimItemObj {
  claim?: number;
  txid?: string;
  index?: number;
  value?: number;
  start?: number;
  end?: number;
}
