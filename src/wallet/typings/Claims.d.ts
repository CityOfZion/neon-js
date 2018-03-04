import { Fixed8 } from '../../utils';
import { ClaimItem, ClaimItemObj } from './ClaimItem';

export class Claims {
  constructor(claims?: ClaimsObj)

  address: string
  net: string
  claims: ClaimItemObj[]

  export(): ClaimsObj
}

export interface ClaimsObj {
  address?: string
  net?: string
  claims?: ClaimItemObj[]
}
