import { Fixed8 } from '../utils'

/**
 * @typedef ClaimItem
 * @property {Fixed8} claim - Amt of gas claimable
 * @property {string} txid - Transaction hash of the originaating coin
 * @property {number} index - Index of coin in the output array
 * @property {number} value - Amount of NEO involved.
 * @property {Fixed8} [start] - Starting block. Optional.
 * @property {Fixed8} [end] - Ending block. Optional.
 */
export default class ClaimItem {
  constructor (config = {}) {
    this.claim = config.claim ? new Fixed8(config.claim) : new Fixed8(0);
    this.txid = config.txid || '';
    this.index = config.index || 0;
    this.value = config.value || 0;
    this.start = config.start ? new Fixed8(config.start) : null;
    this.end = config.end ? new Fixed8(config.end) : null;
  }

  export () {
    return {
      claim: this.claim.toNumber(),
      txid: this.txid,
      index: this.index,
      value: this.value,
      start: this.start ? this.start.toNumber() : null,
      end: this.end ? this.end.toNumber() : null
    }
  }
}
