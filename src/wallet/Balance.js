import { Transaction } from '../transactions'
import { ASSETS } from '../consts'
import { Query } from '../rpc'

/**
 * Balance object describing the coins found within an Account. Look up various balances through its symbol. For example, NEO or GAS.
 */
class Balance {
  constructor (bal) {
    this.address = bal.address
    this.net = bal.net
    this.assetSymbols = bal.assetSymbols ? bal.assetSymbols : []
    this.assets = bal.assets ? bal.assets : {}
    if (bal.assets) {
      Object.keys(bal).map((key) => {
        if (typeof bal[key] === 'object') {
          this.addAsset(key, bal[key])
        }
      })
    }
    this.tokenSymbols = bal.tokenSymbols ? bal.tokenSymbols : []
    this.tokens = bal.tokens ? bal.tokens : {}
  }

  /**
   * Adds a new asset to this Balance.
   * @param {string} sym - The symbol to refer by. This function will force it to upper-case.
   * @param {AssetBalance} [assetBalance] - The assetBalance if initialized. Default is a zero balance object.
   * @return this
   */
  addAsset (sym, assetBalance = { balance: 0, spent: [], unspent: [], unconfirmed: [] }) {
    sym = sym.toUpperCase()
    this.assetSymbols.push(sym)
    this.assets[sym] = Object.assign({}, { balance: 0, spent: [], unspent: [], unconfirmed: [] }, assetBalance)
    return this
  }

  /**
   * Adds a new NEP-5 Token to this Balance.
   * @param {string} sym - The NEP-5 Token Symbol to refer by.
   * @param {number} tokenBalance - The amount of tokens this account holds.
   * @return this
   */
  addToken (sym, tokenBalance = 0) {
    sym = sym.toUpperCase()
    this.tokenSymbols.push(sym)
    this.tokens[sym] = tokenBalance
    return this
  }

  /**
   * Applies a Transaction to a Balance, removing spent coins and adding new coins. This currently applies only to Assets.
   * @param {Transaction|string} tx - Transaction that has been sent and accepted by Node.
   * @param {boolean} confirmed - If confirmed, new coins will be added to unspent. Else, new coins will be added to unconfirmed property first.
   * @return {Balance} this
   */
  applyTx (tx, confirmed = false) {
    tx = tx instanceof Transaction ? tx : Transaction.deserialize(tx)
    const symbols = this.assetSymbols
    // Spend coins
    for (const input of tx.inputs) {
      const findFunc = (el) => el.txid === input.prevHash && el.index === input.prevIndex
      for (const sym of symbols) {
        let assetBalance = this.assets[sym]
        let ind = assetBalance.unspent.findIndex(findFunc)
        if (ind >= 0) {
          let spentCoin = assetBalance.unspent.splice(ind, 1)
          assetBalance.spent = assetBalance.spent.concat(spentCoin)
          break
        }
      }
    }

    // Add new coins
    const hash = tx.hash
    for (let i = 0; i < tx.outputs.length; i++) {
      const output = tx.outputs[i]
      const sym = ASSETS[output.assetId]
      let assetBalance = this.assets[sym]
      if (!assetBalance) this.addAsset(sym)
      const coin = { index: i, txid: hash, value: output.value }
      if (confirmed) {
        assetBalance.balance += output.value
        if (!assetBalance.unspent) assetBalance.unspent = []
        assetBalance.unspent.push(coin)
      } else {
        if (!assetBalance.unconfirmed) assetBalance.unconfirmed = []
        assetBalance.unconfirmed.push(coin)
      }
      this.assets[sym] = assetBalance
    }

    return this
  }

  /**
   * Verifies the coins in balance are unspent. This is an expensive call.
   * @param {string} url - NEO Node to check against.
   * @return {Promise<Balance>} Returns this
   */
  verifyAssets (url) {
    const promises = []
    const symbols = this.assetSymbols
    symbols.map((key) => {
      const assetBalance = this.assets[key]
      promises.push(verifyAssetBalance(url, assetBalance))
    })
    return Promise.all(promises)
      .then((newBalances) => {
        symbols.map((sym, i) => {
          this.assets[sym] = newBalances[i]
        })
        return this
      })
  }
}

/**
 * Verifies an AssetBalance
 * @param {string} url
 * @param {AssetBalance} assetBalance
 * @return {Promise<AssetBalance>} Returns a new AssetBalance
 */
export const verifyAssetBalance = (url, assetBalance) => {
  let newAssetBalance = { balance: 0, spent: [], unspent: [], unconfirmed: [] }
  return verifyCoins(url, assetBalance.unspent)
    .then((values) => {
      values.map((v, i) => {
        let coin = assetBalance.unspent[i]
        if (v) {
          if (v.value !== coin.value) coin.value = v.value
          newAssetBalance.unspent.push(coin)
          newAssetBalance.balance += coin.value
        } else {
          newAssetBalance.spent.push(coin)
        }
      })
      return newAssetBalance
    })
}

/**
 * Verifies a list of Coins
 * @param {string} url
 * @param {Coin[]} coinArr
 * @return {Promise<Coin[]>}
 */
export const verifyCoins = (url, coinArr) => {
  const promises = []
  for (const coin of coinArr) {
    const promise = Query.getTxOut(coin.txid, coin.index)
      .execute(url)
      .then(({ result }) => {
        if (!result) return null
        return {
          txid: coin.txid,
          index: result.n,
          assetId: result.asset,
          value: parseInt(result.value, 10)
        }
      })
    promises.push(promise)
  }
  return Promise.all(promises)
}

export default Balance
