import * as neonDB from './neonDB'
import * as neoscan from './neoscan'
import { Account } from '../wallet'
import { ASSET_ID } from '../consts'
import { Query } from '../rpc'
import { Transaction, TransactionOutput, TxAttrUsage } from '../transactions'
import { reverseHex } from '../utils'
import logger from '../logging'

const log = logger('api')

/** This determines which API we should dial.
 * 0 means 100% neoscan
 * 1 means 100% neonDB
 * This is ensure that we do not always hit the failing endpoint.
 */
let apiSwitch = 0
let switchFrozen = true

/**
 * Sets the API switch to the provided value
 * @param {number} netSetting - The new value between 0 and 1 inclusive.
 */
export const setApiSwitch = newSetting => {
  if (newSetting >= 0 && newSetting <= 1) apiSwitch = newSetting
}

/**
 * Sets the freeze setting for the API switch. A frozen switch will not dynamically shift towards the other provider when the main provider fails.
 *  This does not mean that we do not use the other provider. This only means that we will not change our preference for the main provider.
 * @param {bool} newSetting - The new setting for freeze.
 */
export const setSwitchFreeze = newSetting => {
  switchFrozen = !!newSetting
  log.info(`core/setSwitchFreeze API switch is frozen: ${switchFrozen}`)
}

const increaseNeoscanWeight = () => {
  if (!switchFrozen && apiSwitch > 0) {
    apiSwitch -= 0.2
    log.info(`core API Switch increasing weight towards neoscan`)
  }
}

const increaseNeonDBWeight = () => {
  if (!switchFrozen && apiSwitch < 1) {
    apiSwitch += 0.2
    log.info(`core API Switch increasing weight towards neonDB`)
  }
}
const loadBalance = (func, config) => {
  if (Math.random() > apiSwitch) {
    return func(config, neoscan)
      .then(c => {
        increaseNeoscanWeight()
        return c
      })
      .catch(() => {
        increaseNeonDBWeight()
        return func(config, neonDB)
      })
  } else {
    return func(config, neonDB)
      .then(c => {
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
 * The core API methods are series of methods defined to aid conducting core functionality while making it easy to modify any parts of it.
 * The core functionality are sendAsset, claimGas and doInvoke.
 * These methods are designed to be modular in nature and intended for developers to create their own custom methods.
 * The methods revolve around a configuration object in which everything is placed. Each method will take in the configuration object, check for its required fields and perform its operations, adding its results to the configuration object and returning it.
 * For example, the getBalanceFrom function requires net and address fields and appends the url and balance fields to the object.
 */

/**
 * Helper method to retrieve balance and URL from an endpoint. If URL is provided, it is not overriden.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet' or 'TestNet'
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {object} Configuration object + url + balance
 */
export const getBalanceFrom = (config, api) => {
  checkProperty(config, 'net', 'address')
  if (!api.getBalance || !api.getRPCEndpoint)
    throw new Error('Invalid type. Is this an API object?')
  const balanceP = api.getBalance(config.net, config.address)
  const urlP = api.getRPCEndpoint(config.net)

  return Promise.all([balanceP, urlP])
    .then(values => {
      const override = { balance: values[0] }
      if (!config.url) override.url = values[1]
      return Object.assign(config, override)
    })
    .catch(err => {
      log.error(`getBalanceFrom ${api.name} failed with: ${err.message}`)
      throw err
    })
}

/**
 * Method to retrieve balance and URL from an endpoint. If URL is provided, it is not overriden.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @return {Promise<string>} - URL
 */
export const getBalance = config => {
  return loadBalance(getBalanceFrom, config)
}

/**
 * Helper method to retrieve claims and URL from an endpoint.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet'
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint APi object. eg, neonDB or Neoscan.
 * @return {object} Configuration object + url + balance
 */
export const getClaimsFrom = (config, api) => {
  checkProperty(config, 'net', 'address')
  if (!api.getBalance || !api.getRPCEndpoint)
    throw new Error('Invalid type. Is this an API object?')
  const claimsP = api.getClaims(config.net, config.address)
  // Get URL
  const urlP = api.getRPCEndpoint(config.net)
  // Return {url, balance, ...props}

  return Promise.all([claimsP, urlP])
    .then(values => {
      return Object.assign(config, { claims: values[0], url: values[1] })
    })
    .catch(err => {
      log.error(`getClaimsFrom ${api.name} failed with: ${err.message}`)
      throw err
    })
}

/**
 * Creates a transaction with the given config and txType.
 * @param {object} config - Configuration object.
 * @param {string|number} txType - Transaction Type. Name of transaction or the transaction type number. eg, 'claim' or 2.
 * @return {Promise<object>} Configuration object + tx
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
      return Promise.reject(new Error(`Tx Type not found: ${txType}`))
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
 * @return {Promise<object>} Configuration object.
 */
export const signTx = config => {
  checkProperty(config, 'tx')
  let promise
  if (config.signingFunction) {
    let acct = new Account(config.publicKey)
    promise = config.signingFunction(config.tx, acct.publicKey)
  } else if (config.privateKey) {
    let acct = new Account(config.privateKey)
    if (config.address !== acct.address)
      return Promise.reject(
        new Error('Private Key and Balance address does not match!')
      )
    promise = Promise.resolve(config.tx.sign(acct.privateKey))
  } else {
    return Promise.reject(
      new Error('Needs privateKey or signingFunction to sign!')
    )
  }
  return promise.then(signedTx => {
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
export const sendTx = config => {
  checkProperty(config, 'tx', 'url')
  return Query.sendRawTransaction(config.tx)
    .execute(config.url)
    .then(res => {
      // Parse result
      if (res.result === true) {
        res.txid = config.tx.hash
        if (config.balance) {
          config.balance.applyTx(config.tx, true)
        }
      } else {
        const dump = {
          net: config.net, address: config.address, intents: config.intents, balance: config.balance, claims: config.claims, script: config.script, gas: config.gas, tx: config.tx
        }
        log.error(
          `Transaction failed for ${config.address}: ${config.tx.serialize()}`,
          dump
        )
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
  return Object.keys(assetAmts).map(key => {
    return TransactionOutput({
      assetId: ASSET_ID[key],
      value: assetAmts[key],
      scriptHash: acct.scriptHash
    })
  })
}

/**
 * Function to construct and execute a ContractTransaction.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [config.privateKey] - private key to sign with. Either this or signingFunction and public key is required.
 * @param {function} [config.signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {string} [config.publicKey] - A public key for the singing function. Either this or privateKey is required.
 * @param {TransactionOutput[]} config.intents - Intents.
 * @return {object} Configuration object.
 */
export const sendAsset = config => {
  return loadBalance(getBalanceFrom, config)
    .then(c => createTx(c, 'contract'))
    .then(c => signTx(c))
    .then(c => sendTx(c))
    .catch(err => {
      const dump = {
        net: config.net,
        address: config.address,
        intents: config.intents,
        balance: config.balance,
        tx: config.tx
      }
      log.error(`sendAsset failed with: ${err.message}. Dumping config`, dump)
      throw err
    })
}

/**
 * Perform a ClaimTransaction for all available GAS based on API
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [config.privateKey] - private key to sign with. Either this or signingFunction and publicKey is required.
 * @param {function} [config.signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {string} [config.publicKey] - A public key for the singing function. Either this or privateKey is required.
 * @return {object} Configuration object.
 */
export const claimGas = config => {
  return loadBalance(getClaimsFrom, config)
    .then(c => createTx(c, 'claim'))
    .then(c => signTx(c))
    .then(c => sendTx(c))
    .catch(err => {
      const dump = {
        net: config.net, address: config.address, intents: config.intents, claims: config.claims, tx: config.tx
      }
      log.error(`claimGas failed with ${err.message}. Dumping config`, dump)
      throw err
    })
}

/**
 * Perform a InvocationTransaction based on config given.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [config.privateKey] - private key to sign with. Either this or signingFunction and publicKey is required.
 * @param {function} [config.signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {string} [config.publicKey] - A public key for the singing function. Either this or privateKey is required.
 * @param {object} [config.intents] - Intents
 * @param {string} config.script - VM script. Must include empty args parameter even if no args are present
 * @param {number} config.gas - gasCost of VM script.
 * @return {object} Configuration object.
 */
export const doInvoke = config => {
  return loadBalance(getBalanceFrom, config)
    .then(c => addAttributesForMintToken(c))
    .then(c => createTx(c, 'invocation'))
    .then(c => signTx(c))
    .then(c => attachInvokedContractForMintToken(c))
    .then(c => sendTx(c))
    .catch(err => {
      const dump = {
        net: config.net, address: config.address, intents: config.intents, balance: config.balance, script: config.script, gas: config.gas, tx: config.tx
      }
      log.error(`doInvoke failed with ${err.message}. Dumping config`, dump)
      throw err
    })
}

/**
 * Adds attributes to the override object for mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {object} Configuration object.
 */
const addAttributesForMintToken = config => {
  if (!config.override) config.override = {}
  if (
    typeof config.script === 'object' &&
    config.script.operation === 'mintTokens' &&
    config.script.scriptHash
  ) {
    config.override.attributes = [
      {
        data: reverseHex(config.script.scriptHash),
        usage: TxAttrUsage.Script
      }
    ]
  }
  return config
}

/**
 * Adds the contractState to mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {object} Configuration object.
 */
const attachInvokedContractForMintToken = config => {
  if (
    typeof config.script === 'object' &&
    config.script.operation === 'mintTokens' &&
    config.script.scriptHash
  ) {
    return Query.getContractState(config.script.scriptHash)
      .execute(config.url)
      .then(contractState => {
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

/**
 * Check that properties are defined in obj.
 * @param {object} obj - Object to check.
 * @param {string[]}  props - List of properties to check.
 */
const checkProperty = (obj, ...props) => {
  for (const prop of props) {
    if (!obj.hasOwnProperty(prop)) {
      throw new ReferenceError(`Property not found: ${prop}`)
    }
  }
}

/**
 * Helper method to returns an appropriate RPC endpoint retrieved from an endpoint.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {Promise<string>} - URL
 */
export const getRPCEndpointFrom = (config, api) => {
  checkProperty(config, 'net')
  if (!api.getRPCEndpoint)
    throw new Error('Invalid type. Is this an API object?')
  const { net } = config
  return api.getRPCEndpoint(net)
}

/**
 * Returns an appropriate RPC endpoint retrieved from an endpoint.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @return {Promise<string>} - URL
 */
export const getRPCEndpoint = config => {
  return loadBalance(getRPCEndpointFrom, config)
}

/**
 * Helper method to get transaction history for an account
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {Promise<string>} - URL
 */
export const getTransactionHistoryFrom = (config, api) => {
  checkProperty(config, 'net', 'address')
  if (!api.getTransactionHistory)
    throw new Error('Invalid type. Is this an API object?')
  const { address, net } = config
  return api.getTransactionHistory(net, address)
}

/**
 * Get transaction history for an account
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @param {string} config.address - Wallet address
 * @return {Promise<string>} - URL
 */
export const getTransactionHistory = config => {
  return loadBalance(getTransactionHistoryFrom, config)
}

/**
 * Helper method to get the current height of the light wallet DB
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {Promise<string>} - URL
 */
export const getWalletDBHeightFrom = (config, api) => {
  checkProperty(config, 'net')
  if (!api.getWalletDBHeight)
    throw new Error('Invalid type. Is this an API object?')
  const { net } = config
  return api.getWalletDBHeight(net)
}

/**
 * Get the current height of the light wallet DB
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @return {Promise<string>} - URL
 */
export const getWalletDBHeight = config => {
  return loadBalance(getWalletDBHeightFrom, config)
}

/**
 * Helper method to get the maximum amount of gas claimable after spending all NEO.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet'
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint APi object. eg, neonDB or Neoscan.
 * @return {object} Configuration object + url + balance
 */
export const getMaxClaimAmountFrom = (config, api) => {
  checkProperty(config, 'net', 'address')
  if (!api.getMaxClaimAmount)
    throw new Error('Invalid type. Is this an API object?')
  const { net, address } = config
  return api.getMaxClaimAmount(net, address)
}

/**
 * Method to get the maximum amount of gas claimable after spending all NEO.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @return {Promise<string>} - URL
 */
export const getMaxClaimAmount = config => {
  return loadBalance(getClaimsFrom, config)
}
