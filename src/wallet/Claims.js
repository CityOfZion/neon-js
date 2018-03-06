import { ClaimItem, exportClaimItem } from './components/ClaimItem'
import util from 'util'

/**
 * @class Claims
 * @classdesc
 * Claims object used for claiming GAS.
 * @param {Claims} config - Claims-like object
 * @param {string} config.net - Network
 * @param {string}  config.address - The address for this Claims
 * @param {ClaimItem[]} config.claims - The list of claims to be made.
 */
class Claims {
  constructor (config = {}) {
    /** The address for this Claims */
    this.address = config.address || ''
    /** Network which this Claims is using */
    this.net = config.net || 'NoNet'
    /** The list of claimable transactions */
    this.claims = config.claims ? config.claims.map(c => ClaimItem(c)) : []
  }

  get [Symbol.toStringTag] () {
    return 'Claims'
  }

  [util.inspect.custom] (depth, opts) {
    const claimsDump = this.claims.map(c => {
      return `${c.txid} <${c.index}>: ${c.claim.toString()}`
    })
    return `[Claims(${this.net}): ${this.address}]\n${JSON.stringify(claimsDump, null, 2)}`
  }

  export () {
    return {
      address: this.address,
      net: this.net,
      claims: this.claims.map(exportClaimItem)
    }
  }

  /**
   * Returns a Claims object that contains part of the total claims starting at [[start]], ending at [[end]].
   * @param {number} start
   * @param {number} [end] - Optional.
   * @return {Claims}
   */
  slice (start, end = undefined) {
    return new Claims({
      address: this.address,
      net: this.net,
      claims: this.claims.slice(start, end)
    })
  }
}

export default Claims
