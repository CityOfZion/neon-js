import { AssetBalance } from './components'
import { Transaction } from '../transactions'
import { ASSETS } from '../consts'
import { Fixed8 } from '../utils'
import { Query } from '../rpc'

/**
 * @class Balance
 * @classdesc object describing the coins found within an Account. Look up various balances through its symbol. For example, NEO or GAS.
 * @param {object} bal - Balance object as a JSON.
 * @param {string} bal.net - 'MainNet' or 'TestNet'
 * @param {string} bal.address - The address of the Account
 * @param {string[]} bal.assetSymbols - The symbols of the assets available in this Balance
 * @param {object} bal.assets - The collection of assets in this Balance
 * @param {string[]} bal.tokenSymbols - The symbols of the tokens available in this Balance
 * @param {object} bal.tokens - The collection of tokens in this Balance
 */
class Balance {
  constructor (bal = {}) {
    /** The address for this Balance */
    this.address = bal.address || ''
    /** The network for this Balance */
    this.net = bal.net || 'NoNet'
    /** The symbols of assets found in this Balance. Use this symbol to find the corresponding key in the assets object. */
    this.assetSymbols = bal.assetSymbols ? bal.assetSymbols : []
    /** The object containing the balances for each asset keyed by its symbol. */
    this.assets = {}
    if (bal.assets) {
      Object.keys(bal.assets).map((key) => {
        if (typeof bal.assets[key] === 'object') {
          this.addAsset(key, bal.assets[key])
        }
      })
    }
    /** The symbols of the NEP5 tokens in this Balance. Use this symbol to find the corresponding key in the tokens object. */
    this.tokenSymbols = bal.tokenSymbols ? bal.tokenSymbols : []
    /** The token balances in this Balance for each token keyed by its symbol. */
    this.tokens = bal.tokens ? bal.tokens : {}
  }

  /**
   * Imports a string
   * @param {string} jsonString
   * @return {Balance}
   */
  static import (jsonString) {
    const balanceJson = JSON.parse(jsonString)
    return new Balance(balanceJson)
  }

  /**
   * Adds a new asset to this Balance.
   * @param {string} sym - The symbol to refer by. This function will force it to upper-case.
   * @param {AssetBalance} [assetBalance] - The assetBalance if initialized. Default is a zero balance object.
   * @return this
   */
  addAsset (sym, assetBalance = AssetBalance()) {
    sym = sym.toUpperCase()
    this.assetSymbols.push(sym)
    const cleanedAssetBalance = AssetBalance(assetBalance)
    this.assets[sym] = cleanedAssetBalance
    return this
  }

  /**
   * Adds a new NEP-5 Token to this Balance.
   * @param {string} sym - The NEP-5 Token Symbol to refer by.
   * @param {number|Fixed8} tokenBalance - The amount of tokens this account holds.
   * @return this
   */
  addToken (sym, tokenBalance = 0) {
    sym = sym.toUpperCase()
    this.tokenSymbols.push(sym)
    this.tokens[sym] = new Fixed8(tokenBalance)
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
        let unconfirmedIndex = assetBalance.unconfirmed.findIndex((el) => el.txid === coin.txid && el.index === coin.index)
        if (unconfirmedIndex >= 0) {
          assetBalance.unconfirmed.splice(unconfirmedIndex, 1)
        }
        assetBalance.balance = assetBalance.balance.add(output.value)
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
   * Informs the Balance that the next block is confirmed, thus moving all unconfirmed transaction to unspent.
   * @return {Balance}
   */
  confirm () {
    for (const sym of this.assetSymbols) {
      let assetBalance = this.assets[sym]
      assetBalance.unspent = assetBalance.unspent.concat(assetBalance.unconfirmed)
      assetBalance.unconfirmed = []
    }
    return this
  }

  /**
   * Export this class as a string
   * @return {string}
   */
  export () {
    return JSON.stringify({
      net: this.net,
      address: this.address,
      assetSymbols: this.assetSymbols,
      assets: this.assets,
      tokenSymbols: this.tokenSymbols,
      tokens: this.tokens
    })
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
const verifyAssetBalance = (url, assetBalance) => {
  let newAssetBalance = { balance: new Fixed8(0), spent: [], unspent: [], unconfirmed: [] }
  return verifyCoins(url, assetBalance.unspent)
    .then((values) => {
      values.map((v, i) => {
        let coin = assetBalance.unspent[i]
        if (v) {
          if (v.value.cmp(coin.value) !== 0) coin.value = v.value
          newAssetBalance.unspent.push(coin)
          newAssetBalance.balance = newAssetBalance.balance.add(coin.value)
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
const verifyCoins = (url, coinArr) => {
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
          value: new Fixed8(result.value)
        }
      })
    promises.push(promise)
  }
  return Promise.all(promises)
}

export default Balance
