import { Fixed8 } from '../../utils'

/**
 * @typedef ClaimItem
 * @property {Fixed8} claim - Amt of gas claimable
 * @property {string} txid - Transaction hash of the originaating coin
 * @property {number} index - Index of coin in the output array
 * @property {number} value - Amount of NEO involved.
 * @property {Fixed8} [start] - Starting block. Optional.
 * @property {Fixed8} [end] - Ending block. Optional.
 */
export const ClaimItem = (claimItem = {}) => {
  return {
    claim: claimItem.claim ? new Fixed8(claimItem.claim) : new Fixed8(0),
    txid: claimItem.txid || '',
    index: claimItem.index || 0,
    value: claimItem.value || 0,
    start: claimItem.start ? new Fixed8(claimItem.start) : null,
    end: claimItem.end ? new Fixed8(claimItem.end) : null
  }
}

export const exportClaimItem = claimItem => {
  return {
    claim: claimItem.claim.toNumber(),
    txid: claimItem.txid,
    index: claimItem.index,
    value: claimItem.value,
    start: claimItem.start ? claimItem.start.toNumber() : null,
    end: claimItem.end ? claimItem.end.toNumber() : null
  }
}
