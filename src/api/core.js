import * as neonDB from './neonDB'
import * as neoscan from './neoscan'
import { Account } from '../wallet'
import { ASSET_ID } from '../consts'
import { Query } from '../rpc'
import { Transaction } from '../transactions'
import { reverseHex } from '../utils'
import { txAttrUsage } from '../transactions/txAttrUsage'

/** This determines which API we should dial.
* 0 means 100% neoscan
* 1 means 100% neonDB
* This is ensure that we do not always hit the failing endpoint.
*/
var apiSwitch = 1
var switchFrozen = true
export const setApiSwitch = (newSetting) => {
  if (newSetting >= 0 && newSetting <= 1) apiSwitch = newSetting
}

export const setSwitchFreeze = (newSetting) => {
  switchFrozen = !!newSetting
}

const increaseNeoscanWeight = () => {
  if (!switchFrozen && apiSwitch > 0) apiSwitch -= 0.2
}

const increaseNeonDBWeight = () => {
  if (!switchFrozen && apiSwitch < 1) apiSwitch += 0.2
}
const loadBalance = (func, config) => {
  if (Math.random() > apiSwitch) {
    return func(config, neoscan)
      .then((c) => {
        increaseNeoscanWeight()
        return c
      })
      .catch(() => {
        increaseNeonDBWeight()
        return func(config, neonDB)
      })
  } else {
    return func(config, neonDB)
      .then((c) => {
        increaseNeonDBWeight()
        return c
      })
      .catch(() => {
        increaseNeoscanWeight()
        return func(config, neoscan)
      })
  }
}

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
  if (!api.getBalance || !api.getRPCEndpoint) throw new Error('Invalid type. Is this an API object?')
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
  if (!api.getBalance || !api.getRPCEndpoint) throw new Error('Invalid type. Is this an API object?')
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
      tx = Transaction.createInvocationTx(config.balance, config.intents, config.script, config.gas, config.override)
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
    if (config.address !== acct.address) throw new Error('Private Key and Balance address does not match!')
    promise = Promise.resolve(config.tx.sign(config.privateKey))
  } else {
    throw new Error('Needs privateKey or signingFunction to sign!')
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
        if (config.balance) {
          config.balance.applyTx(config.tx, true)
        }
      }
      return Object.assign(config, { response: res })
    })
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
 * @param {string} [config.privateKey] - private key to sign with. Either this or signingFunction is required.
 * @param {function} [config.signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {TransactionOutput[]} config.intents - Intents.
 * @return {object} Configuration object.
 */
export const sendAsset = (config) => {
  return loadBalance(getBalanceFrom, config)
    .then((c) => createTx(c, 'contract'))
    .then((c) => signTx(c))
    .then((c) => sendTx(c))
}

/**
 * Perform a ClaimTransaction for all available GAS based on API
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [config.privateKey] - private key to sign with. Either this or signingFunction is required.
 * @param {function} [config.signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @return {object} Configuration object.
 */
export const claimGas = (config) => {
  return loadBalance(getClaimsFrom, config)
    .then((c) => createTx(c, 'claim'))
    .then((c) => signTx(c))
    .then((c) => sendTx(c))
}

/**
 * Perform a InvocationTransaction based on config given.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [config.privateKey] - private key to sign with. Either this or signingFunction is required.
 * @param {function} [config.signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {object} [config.intents] - Intents
 * @param {string} config.script - VM script. Must include empty args parameter even if no args are present
 * @param {number} config.gas - gasCost of VM script.
 * @return {object} Configuration object.
 */
export const doInvoke = (config) => {
  return loadBalance(getBalanceFrom, config)
    .then((c) => addAttributesForMintToken(c))
    .then((c) => createTx(c, 'invocation'))
    .then((c) => signTx(c))
    .then((c) => attachInvokedContractForMintToken(c))
    .then((c) => sendTx(c))
}

/**
 * Adds attributes to the override object for mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {object} Configuration object.
 */
const addAttributesForMintToken = (config) => {
  if (!config.override) config.override = {}
  if ((typeof config.script === 'object') && config.script.operation === 'mintTokens' && config.script.scriptHash) {
    config.override.attributes = [{
      data: reverseHex(config.script.scriptHash),
      usage: txAttrUsage.Script
    }]
  }
  return config
}

/**
 * Adds the contractState to mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {object} Configuration object.
 */
const attachInvokedContractForMintToken = (config) => {
  if ((typeof config.script === 'object') && config.script.operation === 'mintTokens' && config.script.scriptHash) {
    return Query.getContractState(config.script.scriptHash).execute(config.url)
      .then((contractState) => {
        const attachInvokedContract = {
          invocationScript: '0000',
          verificationScript: contractState.result.script
        }
        config.tx.scripts.unshift(attachInvokedContract)
        return config
      })
  }
  return config
}
