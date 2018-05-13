import { Account, getScriptHashFromAddress, generateRandomArray } from '../wallet'
import { ASSET_ID } from '../consts'
import { Query } from '../rpc'
import { Transaction, TransactionOutput, TxAttrUsage } from '../transactions'
import { reverseHex, ab2hexstring } from '../utils'
import { loadBalance } from './switch'
import logger from '../logging'

const log = logger('api')

/**
 * The core API methods are series of methods defined to aid conducting core functionality while making it easy to modify any parts of it.
 * The core functionality are sendAsset, claimGas and doInvoke.
 * These methods are designed to be modular in nature and intended for developers to create their own custom methods.
 * The methods revolve around a configuration object in which everything is placed. Each method will take in the configuration object, check for its required fields and perform its operations, adding its results to the configuration object and returning it.
 * For example, the getBalanceFrom function requires net and address fields and appends the url and balance fields to the object.
 */

/**
 * Function to construct and execute a ContractTransaction.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {string} [config.privateKey] - private key to sign with. Either this or signingFunction and public key is required.
 * @param {function} [config.signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {string} [config.publicKey] - A public key for the singing function. Either this or privateKey is required.
 * @param {TransactionOutput[]} config.intents - Intents.
 * @param {bool} [config.sendingFromSmartContract] - Optionally specify that the source address is a smart contract that doesn't correspond to the private key.
 * @return {Promise<object>} Configuration object.
 */
export const sendAsset = config => {
  return fillUrl(config)
    .then(fillKeys)
    .then(fillBalance)
    .then(c => createTx(c, 'contract'))
    .then(c => addAttributesIfExecutingAsSmartContract(c))
    .then(c => signTx(c))
    .then(c => attachContractIfExecutingAsSmartContract(c))
    .then(c => sendTx(c))
    .catch(err => {
      const dump = {
        net: config.net,
        address: config.address,
        intents: config.intents,
        balance: config.balance,
        tx: config.tx,
        fees: config.fees
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
 * @return {Promise<object>} Configuration object.
 */
export const claimGas = config => {
  return fillUrl(config)
    .then(fillKeys)
    .then(fillClaims)
    .then(c => createTx(c, 'claim'))
    .then(c => signTx(c))
    .then(c => sendTx(c))
    .catch(err => {
      const dump = {
        net: config.net,
        address: config.address,
        intents: config.intents,
        tx: config.tx,
        claims: config.claims
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
 * @param {bool} [config.sendingFromSmartContract] - Optionally specify that the source address is a smart contract that doesn't correspond to the private key.
 * @return {Promise<object>} Configuration object.
 */
export const doInvoke = config => {
  return fillUrl(config)
    .then(fillKeys)
    .then(fillBalance)
    .then(c => createTx(c, 'invocation'))
    .then(c => addAttributesIfExecutingAsSmartContract(c))
    .then(c => addAttributesForMintToken(c))
    .then(attachAttributesForEmptyTransaction)
    .then(c => signTx(c))
    .then(c => attachInvokedContractForMintToken(c))
    .then(c => attachContractIfExecutingAsSmartContract(c))
    .then(c => sendTx(c))
    .catch(err => {
      const dump = {
        net: config.net,
        address: config.address,
        intents: config.intents,
        balance: config.balance,
        tx: config.tx,
        script: config.script,
        gas: config.gas,
        fees: config.fees
      }
      log.error(`doInvoke failed with ${err.message}. Dumping config`, dump)
      throw err
    })
}

/**
 * Retrieves RPC endpoint URL of best available node
 * @param {object} config
 * @return {Promise<object>} Configuration object with url field.
 */
export const fillUrl = config => {
  if (config.url) return Promise.resolve(config)
  return loadBalance(getRPCEndpointFrom, config)
    .then(url => {
      return Object.assign(config, { url })
    })
}

/**
 * Retrieves Balance if no balance has been attached
 * @param {object} config
 * @return {Promise<object>} Configuration object.
 */
export const fillBalance = config => {
  if (config.balance) return Promise.resolve(config)
  return loadBalance(getBalanceFrom, config)
}

/**
 * Fills the relevant key fields if account has been attached.
 * @param {object} config
 * @return {Promise<object>} Configuration object.
 */
export const fillKeys = config => {
  if (config.account) {
    if (!config.address) config.address = config.account.address
    if (!config.privateKey && !config.signingFunction) config.privateKey = config.account.privateKey
    if (!config.publicKey && config.signingFunction) config.publicKey = config.account.publicKey
  }
  return Promise.resolve(config)
}

/**
 * Retrieves Claims if no claims has been attached.
 * @param {object} config
 * @return {Promise<object>} Configuration object.
 */
export const fillClaims = config => {
  if (config.claims) return Promise.resolve(config)
  return loadBalance(getClaimsFrom, config)
}

/**
 * Creates a transaction with the given config and txType.
 * @param {object} config - Configuration object.
 * @param {string|number} txType - Transaction Type. Name of transaction or the transaction type number. eg, 'claim' or 2.
 * @return {Promise<object>} Configuration object + tx
 */
export const createTx = (config, txType) => {
  if (config.tx) return config
  if (typeof txType === 'string') txType = txType.toLowerCase()
  if (!config.fees) config.fees = 0
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
      tx = Transaction.createContractTx(config.balance, config.intents, config.override, config.fees)
      break
    case 'invocation':
    case 209:
      checkProperty(config, 'balance', 'gas', 'script')
      if (!config.intents) config.intents = []
      tx = Transaction.createInvocationTx(config.balance, config.intents, config.script, config.gas, config.override, config.fees)
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
 * @param {bool} [config.sendingFromSmartContract] - Optionally specify that the source address is a smart contract that doesn't correspond to the private key.
 * @return {Promise<object>} Configuration object.
 */
export const signTx = config => {
  checkProperty(config, 'tx')
  let promise
  if (config.signingFunction) {
    let acct = new Account(config.publicKey)
    promise = config.signingFunction(config.tx, acct.publicKey)
      .then(res => {
        if (typeof (res) === 'string') { res = Transaction.deserialize(res) }
        return res
      })
  } else if (config.privateKey) {
    let acct = new Account(config.privateKey)
    if (config.address !== acct.address && !config.sendingFromSmartContract) {
      return Promise.reject(
        new Error('Private Key and Balance address does not match!')
      )
    }
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
 * @return {Promise<object>} Configuration object + response
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
          config.balance.applyTx(config.tx, false)
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
 * Adds attributes to the override object for mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object.
 */
const addAttributesForMintToken = config => {
  if (!config.override) config.override = {}
  if (
    typeof config.script === 'object' &&
    config.script.operation === 'mintTokens' &&
    config.script.scriptHash
  ) {
    config.tx.addAttribute(TxAttrUsage.Script, reverseHex(config.script.scriptHash))
  }
  return Promise.resolve(config)
}

/**
 * Adds the contractState to mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object.
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
        const { parameters } = contractState.result
        const attachInvokedContract = {
          invocationScript: ('00').repeat(parameters.length),
          verificationScript: ''
        }
        const acct = new Account(config.address)
        if (parseInt(config.script.scriptHash, 16) > parseInt(acct.scriptHash, 16)) {
          config.tx.scripts.push(attachInvokedContract)
        } else {
          config.tx.scripts.unshift(attachInvokedContract)
        }
        return config
      })
  } else {
    return Promise.resolve(config)
  }
}

/**
 * Adds attributes to the override object for mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object.
 */
const addAttributesIfExecutingAsSmartContract = config => {
  if (!config.override) config.override = {}

  if (config.sendingFromSmartContract) {
    const acct = config.privateKey ? new Account(config.privateKey) : new Account(config.publicKey)
    config.tx.addAttribute(TxAttrUsage.Script, reverseHex(acct.scriptHash))
  }

  return Promise.resolve(config)
}

/**
 * Adds the contractState to invocations sending from the contract's balance.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object.
 */
const attachContractIfExecutingAsSmartContract = config => {
  if (config.sendingFromSmartContract) {
    const smartContractScriptHash = getScriptHashFromAddress(config.address)

    return Query.getContractState(smartContractScriptHash)
      .execute(config.url)
      .then(contractState => {
        const { parameters } = contractState.result
        const attachInvokedContract = {
          invocationScript: ('00').repeat(parameters.length),
          verificationScript: ''
        }

        // We need to order this for the VM.
        const acct = config.privateKey ? new Account(config.privateKey) : new Account(config.publicKey)
        if (parseInt(smartContractScriptHash, 16) > parseInt(acct.scriptHash, 16)) {
          config.tx.scripts.push(attachInvokedContract)
        } else {
          config.tx.scripts.unshift(attachInvokedContract)
        }

        return config
      })
  }

  return Promise.resolve(config)
}

/**
 * Adds the necessary attributes for validating an empty transaction.
 * @param {object} config
 * @return {Promise<object>}
 */
const attachAttributesForEmptyTransaction = config => {
  if (config.tx.inputs.length === 0 && config.tx.outputs.length === 0) {
    config.tx.addAttribute(TxAttrUsage.Script, reverseHex(getScriptHashFromAddress(config.address)))
    // This adds some random bits to the transaction to prevent any hash collision.
    config.tx.addRemark(Date.now().toString() + ab2hexstring(generateRandomArray(4)))
  }
  return Promise.resolve(config)
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
 * These are a set of helper methods that can be used to retrieve information from 3rd party API in conjunction with the API chain methods
 */

/**
 * Helper method to retrieve balance and URL from an endpoint. If URL is provided, it is not overriden.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet' or 'TestNet'
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {Promise<object>} Configuration object + balance
 */
export const getBalanceFrom = (config, api) => {
  return new Promise((resolve) => {
    checkProperty(config, 'net', 'address')
    if (!api.getBalance || !api.getRPCEndpoint) { throw new Error('Invalid type. Is this an API object?') }
    resolve()
  }).then(() => {
    const { net, address } = config
    return api.getBalance(net, address)
  }).then(balance => {
    return Object.assign(config, { balance })
  })
}

/**
 * Helper method to retrieve claims and URL from an endpoint.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet'
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint APi object. eg, neonDB or Neoscan.
 * @return {Promise<object>} Configuration object + claims
 */
export const getClaimsFrom = (config, api) => {
  return new Promise((resolve) => {
    checkProperty(config, 'net', 'address')
    if (!api.getBalance || !api.getRPCEndpoint) { throw new Error('Invalid type. Is this an API object?') }
    resolve()
  }).then(() => {
    const { net, address } = config
    return api.getClaims(net, address)
  }).then(claims => {
    return Object.assign(config, { claims })
  })
}

/**
 * Helper method to returns an appropriate RPC endpoint retrieved from an endpoint.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {Promise<string>} - url
 */
export const getRPCEndpointFrom = (config, api) => {
  return new Promise((resolve) => {
    checkProperty(config, 'net')
    if (!api.getRPCEndpoint) { throw new Error('Invalid type. Is this an API object?') }
    resolve()
  }).then(() => {
    const { net } = config
    return api.getRPCEndpoint(net)
  })
}

/**
 * Helper method to get transaction history for an account
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {Promise<PastTransaction[]>} - Transaction history
 */
export const getTransactionHistoryFrom = (config, api) => {
  return new Promise((resolve) => {
    checkProperty(config, 'net', 'address')
    if (!api.getTransactionHistory) { throw new Error('Invalid type. Is this an API object?') }
    resolve()
  }).then(() => {
    const { address, net } = config
    return api.getTransactionHistory(net, address)
  })
}

/**
 * Helper method to get the current height of the light wallet DB
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a custom URL.
 * @param {object} api - The endpoint API object. eg, neonDB or Neoscan.
 * @return {Promise<number>} Current height.
 */
export const getWalletDBHeightFrom = (config, api) => {
  return new Promise((resolve) => {
    checkProperty(config, 'net')
    if (!api.getWalletDBHeight) { throw new Error('Invalid type. Is this an API object?') }
    resolve()
  }).then(() => {
    const { net } = config
    return api.getWalletDBHeight(net)
  })
}

/**
 * Helper method to get the maximum amount of gas claimable after spending all NEO.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet'
 * @param {string} config.address - Wallet address
 * @param {object} api - The endpoint APi object. eg, neonDB or Neoscan.
 * @return {Promise<Fixed8>} max claimable GAS
 */
export const getMaxClaimAmountFrom = (config, api) => {
  return new Promise((resolve) => {
    checkProperty(config, 'net', 'address')
    if (!api.getMaxClaimAmount) { throw new Error('Invalid type. Is this an API object?') }
    resolve()
  }).then(() => {
    const { net, address } = config
    return api.getMaxClaimAmount(net, address)
  })
}
