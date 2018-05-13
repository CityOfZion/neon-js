import { Fixed8 } from '../../utils'
import Coin from './Coin'

/**
 * @typedef AssetBalance
 * @property {Fixed8} balance - The total balance in this AssetBalance
 * @property {Coin[]} unspent - Unspent coins
 * @property {Coin[]} spent - Spent coins
 * @property {Coin[]} unconfirmed - Unconfirmed coins
 */
export default (assetBalanceObj = {}) => {
  const {
    balance,
    unspent,
    spent,
    unconfirmed
  } = assetBalanceObj

  return {
    balance: balance ? new Fixed8(balance) : new Fixed8(0),
    unspent: unspent ? unspent.map(coin => Coin(coin)) : [],
    spent: spent ? spent.map(coin => Coin(coin)) : [],
    unconfirmed: unconfirmed ? unconfirmed.map(coin => Coin(coin)) : []
  }
}
