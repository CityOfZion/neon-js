import { Fixed8 } from '../utils'

export default class Claims {
  constructor (config) {
    this.address = config.address
    this.net = config.net
    this.claims = config.claims.map(c => parseClaimItem(c))
  }
}

const parseClaimItem = (c) => {
  return {
    claim: new Fixed8(c.claim),
    start: new Fixed8(c.start),
    end: new Fixed8(c.end),
    index: c.index,
    txid: c.txid
  }
}
