import { Fixed8 } from '../utils'

/**
 * @typedef AssetBalance
 * @property {Fixed8} balance - The total balance in this AssetBalance
 * @property {Coin[]} unspent - Unspent coins
 * @property {Coin[]} spent - Spent coins
 * @property {Coin[]} unconfirmed - Unconfirmed coins
 */
export const AssetBalance = (assetBalance = {}) => {
  return {
    balance: assetBalance.balance ? new Fixed8(assetBalance.balance) : new Fixed8(0),
    unspent: assetBalance.unspent ? assetBalance.unspent.map(coin => Coin(coin)) : [],
    spent: assetBalance.spent ? assetBalance.spent.map(coin => Coin(coin)) : [],
    unconfirmed: assetBalance.unconfirmed ? assetBalance.unconfirmed.map(coin => Coin(coin)) : []
  }
}

/**
* @typedef Coin
* @property {number} index - Index in list.
* @property {string} txid - Transaction ID which produced this coin.
* @property {Fixed8} value - Value of this coin.
*/
export const Coin = (coin = {}) => {
  return {
    index: coin.index || 0,
    txid: coin.txid || '',
    value: coin.value ? new Fixed8(coin.value) : new Fixed8(0)
  }
}

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
