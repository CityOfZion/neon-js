import { ClaimItem } from './components'
import util from 'util'

export default class Claims {
  constructor (config = {}) {
    this.address = config.address || ''
    this.net = config.net || 'NoNet'
    this.claims = config.claims ? config.claims.map(c => ClaimItem(c)) : []
  }

  [util.inspect.custom] (depth, opts) {
    const claimsDump = this.claims.map(c => {
      return `${c.txid} <${c.index}>: ${c.claim.toString()}`
    })
    return `[Claims(${this.net}): ${this.address}]\n${JSON.stringify(claimsDump, null, 2)}`
  }
}
