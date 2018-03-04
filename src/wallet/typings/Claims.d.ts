import { Fixed8 } from '../../utils';
import { ClaimItem } from './ClaimItem';

export interface Claims {
  address?: string
  net?: string
  claims?: ClaimItem[]
}

/** Claims object used for claiming GAS. */
export class Claims {
  constructor(claims?: Claims)

  /** The address for this Claims */
  address?: string

  /** Network which this Claims is using */
  net?: string

  /** The list of claimable transactions */
  claims?: ClaimItem[]

  export(): Claims

  /** Returns a Claims object that contains part of the total claims starting at [[start]], ending at [[end]]. */
  slice (start: number, end?: number): Claims
}
