import * as neonDB from './neonDB'
import * as neoscan from './neoscan'
import { Account } from '../wallet'
import { ASSETS, ASSET_ID } from '../consts'
import { Query } from '../rpc'
import { Transaction } from '../transactions'

/**
 * Check that properties are defined in obj.
 * @param {object} obj - Object to check.
 * @param {string[]}  props - List of properties to check.
 */
const checkProperty = (obj, ...props) => {
  for (const prop of props) {
    if (!obj.hasOwnProperty(prop)) {
      throw new Error(`Property not found: ${prop}`)
    }
  }
}

/**
 * Helper method to retrieve balance and URL from an endpoint. If URL is provided, it is not overriden.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {object} Configuration object + url + balance
 */
export const getBalanceFrom = (config, api) => {
  checkProperty(config, 'net', 'address')
  if (!api.getBalance || !api.getRPCEndpoint) throw new Error(`Invalid type. Is this an API object?`)
  const balanceP = api.getBalance(config.net, config.address)
  const urlP = api.getRPCEndpoint(config.net)

  return Promise.all([balanceP, urlP])
    .then((values) => {
      const override = { balance: values[0] }
      if (!config.url) override.url = values[1]
      return Object.assign(config, override)
    })
}

/**
 * Helper method to retrieve claims and URL from an endpoint.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint APi object. eg, neonDB or Neoscan.
 * @return {object} Configuration object + url + balance
 */
export const getClaimsFrom = (config, api) => {
  checkProperty(config, 'net', 'address')
  if (!api.getBalance || !api.getRPCEndpoint) throw new Error(`Invalid type. Is this an API object?`)
  const claimsP = api.getClaims(config.net, config.address)
  // Get URL
  const urlP = api.getRPCEndpoint(config.net)
  // Return {url, balance, ...props}

  return Promise.all([claimsP, urlP])
    .then((values) => {
      return Object.assign(config, { claims: values[0], url: values[1] })
    })
}

/**
 * Creates a transaction with the given config and txType.
 * @param {object} config - Configuration object.
 * @param {string|number} txType - Transaction Type. Name of transaction or the transaction type number. eg, 'claim' or 2.
 * @return {object} Configuration object + tx
 */
export const createTx = (config, txType) => {
  if (typeof txType === 'string') txType = txType.toLowerCase()
  let tx
  switch (txType) {
    case 'claim':
    case 2:
      checkProperty(config, 'claims')
      tx = Transaction.createClaimTx(config.address, config.claims)
      break
    case 'contract':
    case 128:
      checkProperty(config, 'balance', 'intents')
      tx = Transaction.createContractTx(config.balance, config.intents)
      break
    case 'invocation':
    case 209:
      checkProperty(config, 'balance', 'gas', 'script')
      if (!config.intents) config.intents = []
      tx = Transaction.createInvocationTx(config.balance, config.intents, config.script, config.gas)
      break
    default:
      throw new Error(`Tx Type not found: ${txType}`)
  }
  return Promise.resolve(Object.assign(config, { tx }))
}

/**
 * Signs a transaction within the config object.
 * @param {object} config - Configuration object.
 * @param {Transaction} config.tx - Transaction.
 * @param {string} [config.privateKey] - private key to sign with.
 * @param {string} [config.publicKey] - public key. Required if using signingFunction.
 * @param {function} [config.signingFunction] - External signing function. Requires publicKey.
 * @return {object} Configuration object.
 */
export const signTx = (config) => {
  checkProperty(config, 'tx')
  let promise
  if (config.signingFunction) {
    let acct = new Account(config.publicKey)
    promise = config.signingFunction(config.tx, acct.publicKey)
  } else if (config.privateKey) {
    let acct = new Account(config.privateKey)
    if (config.address !== acct.address) throw new Error(`Private Key and Balance address does not match!`)
    promise = Promise.resolve(config.tx.sign(config.privateKey))
  } else {
    throw new Error(`Needs privateKey or signingFunction to sign!`)
  }
  return promise.then((signedTx) => {
    return Object.assign(config, { tx: signedTx })
  })
}

/**
 * Sends a transaction off within the config object.
 * @param {object} config - Configuration object.
 * @param {Transaction} config.tx - Signed transaction.
 * @param {string} config.url - NEO Node URL.
 * @return {object} Configuration object + response
 */
export const sendTx = (config) => {
  checkProperty(config, 'tx', 'url')
  return Query.sendRawTransaction(config.tx)
    .execute(config.url)
    .then((res) => {
      // Parse result
      if (res.result === true) {
        res.txid = config.tx.hash
      }
      return Object.assign(config, { response: res })
    })
}

/**
 * Applies a Transaction to a Balance, removing spent coins and adding new coins.
 * @param {Transaction|string} tx - Transaction that has been sent and accepted by Node.
 * @param {Balance} balance - Balance to update.
 * @param {boolean} confirmed - If confirmed, new coins will be added to unspent. Else, new coins will be added to unconfirmed property first.
 * @return {Balance} Updated balance object. Do note that the original object is edited in place.
 */
export const applyTx = (tx, balance, confirmed = false) => {
  tx = tx instanceof Transaction ? tx : Transaction.deserialize(tx)
  const symbols = Object.keys(balance).filter((key) => !!balance[key].unspent)
  // Spend coins
  for (const input of tx.inputs) {
    const findFunc = (el) => el.txid === input.prevHash && el.index === input.prevIndex
    for (const sym of symbols) {
      let ind = balance[sym].unspent.findIndex(findFunc)
      if (ind >= 0) {
        let spentCoin = balance[sym].unspent.splice(ind, 1)
        balance[sym].spent = balance[sym].spent ? balance[sym].spent.concat(spentCoin) : spentCoin
        break
      }
    }
  }

  // Add new coins
  const hash = tx.hash
  for (let i = 0; i < tx.outputs.length; i++) {
    const output = tx.outputs[i]
    const sym = ASSETS[output.assetId]
    let assetBalance = balance[sym]
    if (!assetBalance) assetBalance = { balance: 0, spent: [], unspent: [], unconfirmed: [] }
    const coin = { index: i, txid: hash, value: output.value }
    if (confirmed) {
      assetBalance.balance += output.value
      if (!assetBalance.unspent) assetBalance.unspent = []
      assetBalance.unspent.push(coin)
    } else {
      if (!assetBalance.unconfirmed) assetBalance.unconfirmed = []
      assetBalance.unconfirmed.push(coin)
    }
    balance[sym] = assetBalance
  }

  return balance
}

/**
 * Helper method to convert a AssetAmounts object to intents (TransactionOutput[]).
 * @param {object} assetAmts - Asset Amounts
 * @param {number} assetAmts.NEO - Amt of NEO to send.
 * @param {number} assetAmts.GAS - Amt of GAS to send.
 * @param {string} address - The address to send to.
 * @return {TransactionOutput[]} TransactionOutput
 */
export const makeIntent = (assetAmts, address) => {
  const acct = new Account(address)
  return Object.keys(assetAmts).map((key) => {
    return { assetId: ASSET_ID[key], value: assetAmts[key], scriptHash: acct.scriptHash }
  })
}

/**
 * Function to construct and execute a ContractTransaction.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [privateKey] - private key to sign with. Either this or signingFunction is required.
 * @param {function} [signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {TransactionOutput[]} intents - Intents.
 * @return {object} Configuration object.
 */
export const sendAsset = (config) => {
  return getBalanceFrom(config, neonDB)
    .then(
    (c) => c,
    () => getBalanceFrom(config, neoscan)
    )
    .then((c) => createTx(c, 'contract'))
    .then((c) => signTx(c))
    .then((c) => sendTx(c))
}

/**
 * Perform a ClaimTransaction for all available GAS based on API
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [privateKey] - private key to sign with. Either this or signingFunction is required.
 * @param {function} [signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @return {object} Configuration object.
 */
export const claimGas = (config) => {
  return getClaimsFrom(config, neonDB)
    .then(
    (c) => c,
    () => getClaimsFrom(config, neoscan)
    )
    .then((c) => createTx(c, 'claim'))
    .then((c) => signTx(c))
    .then((c) => sendTx(c))
}

/**
 * Perform a InvocationTransaction based on config given.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [privateKey] - private key to sign with. Either this or signingFunction is required.
 * @param {function} [signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {object} [intents] - Intents
 * @param {string} config.script - VM script.
 * @param {number} config.gas - gasCost of VM script.
 * @return {object} Configuration object.
 */
export const doInvoke = (config) => {
  return getBalanceFrom(config, neonDB)
    .then(
    (c) => c,
    () => getBalanceFrom(config, neoscan)
    )
    .then((c) => createTx(c, 'invocation'))
    .then((c) => signTx(c))
    .then((c) => sendTx(c))
}

/**
 * Verifies that the coins in the balance provided are unspent. This is not meant to be used regularly.
 * @param {string} url - NEO Node to check against.
 * @param {Balance} balance - The Balance to verify.
 * @return {Promise<Balance>} Balance with spent coins shifted to spent array.
 */
export const verifyBalance = (url, balance) => {
  const skip = ['address', 'net']
  const promises = []
  const symbols = []
  Object.keys(balance).map((key) => {
    if (skip.indexOf(key) >= 0) return
    const assetBalance = balance[key]
    promises.push(verifyAssetBalance(url, assetBalance))
    symbols.push(key)
  })
  return Promise.all(promises)
    .then((newBalances) => {
      const output = { address: balance.address, net: balance.net }
      symbols.map((sym, i) => {
        output[sym] = newBalances[i]
      })
      return output
    })
}

/**
 * Verifies an AssetBalance
 * @param {string} url
 * @param {AssetBalance} assetBalance
 * @return {Promise<AssetBalance>}
 */
const verifyAssetBalance = (url, assetBalance) => {
  let newAssetBalance = { balance: 0, spent: [], unspent: [] }
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
          value: parseInt(result.value, 10)
        }
      })
    promises.push(promise)
  }
  return Promise.all(promises)
}
