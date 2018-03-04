import { Fixed8 } from '../../utils';

export interface ClaimItem {
  claim?: number;
  txid?: string;
  index?: number;
  value?: number;
  start?: number;
  end?: number;
}

export function ClaimItem (config: ClaimItem): ClaimItem;

export function exportClaimItem(claimItem: ClaimItem): ClaimItem;
