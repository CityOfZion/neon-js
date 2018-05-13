import { Fixed8 } from '../../utils';
import { ClaimItem, ClaimItemLike } from './ClaimItem';

export interface ClaimsLike {
  address?: string
  net?: string
  claims?: ClaimItemLike[]
}

/** Claims object used for claiming GAS. */
export class Claims {
  constructor(claims?: ClaimsLike)

  /** The address for this Claims */
  address?: string

  /** Network which this Claims is using */
  net?: string

  /** The list of claimable transactions */
  claims?: ClaimItem[]

  export(): ClaimsLike

  /** Returns a Claims object that contains part of the total claims starting at [[start]], ending at [[end]]. */
  slice (start: number, end?: number): Claims
}
