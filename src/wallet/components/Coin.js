import { Fixed8 } from '../../utils'

/**
* @typedef Coin
* @property {number} index - Index in list.
* @property {string} txid - Transaction ID which produced this coin.
* @property {Fixed8} value - Value of this coin.
*/
export default (coinObj = {}) => {
  return {
    index: coinObj.index || 0,
    txid: coinObj.txid || '',
    value: coinObj.value ? new Fixed8(coinObj.value) : new Fixed8(0)
  }
}
