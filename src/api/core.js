import { Account } from '../wallet'
import { ASSET_ID } from '../consts'
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
 * Helper method to retrieve balance and URL from a certain endpoint.
 * @param {object} config - Configuration object.
 * @param {string} config.net - 'MainNet', 'TestNet' or a neon-wallet-db URL.
 * @param {string} config.address - Wallet address
 * @param {object} type - The endpoint APi object. eg, neonDB or Neoscan.
 * @return {object} The config object + url + balance
 */
export const getBalanceFrom = (config, type) => {
  checkProperty(config, 'net', 'address')
  if (!type.getBalance || !type.getRPCEndpoint) throw new Error(`Invalid type. Is this an API object?`)
  const balanceP = type.getBalance(config.net, config.address)
  // Get URL
  const urlP = type.getRPCEndpoint(config.net)
  // Return {url, balance, ...props}

  return Promise.all([balanceP, urlP])
    .then((values) => {
      return Object.assign(config, { balance: values[0], url: values[1] })
    })
}

/**
 * Helper method to convert a AssetAmounts object to intents (TransactionOutput[]).
 * @param {object} assetAmts - Asset Amounts
 * @param {number} assetAmts.NEO - Amt of NEO to send.
 * @param {number} assetAmts.GAS - Amt of GAS to send.
 * @param {string} address - The address to send to.
 * @return {}
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
 * @param {string} config.url - RPC URL.
 * @param {Balance} config.balance - The balance of an address from which funds are moving out from.
 * @param {string} [privateKey] - private key to sign with. Either this or signingFunction is required.
 * @param {function} [signingFunction] - An external signing function to sign with. Either this or privateKey is required.
 * @param {TransactionOutput[]} intents - Intents.
 * @return {Response} The RPC response.
 */
export const sendAsset = (config) => {
  if (!config.privateKey && !config.signingFunction) throw new Error(`Needs privateKey or signingFunction to sign!`)
  checkProperty(config, 'balance', 'url', 'intents')
  // Form Tx
  const unsignedTx = Transaction.createContractTx(config.balance, config.intents)
  // Sign Tx
  let signedTx
  let signedTxPromise
  if (config.signingFunction) {
    let acct = new Account(config.balance.address)
    signedTxPromise = config.signingFunction(unsignedTx, acct.publicKey)
  } else if (config.privateKey) {
    signedTxPromise = Promise.resolve(unsignedTx.sign(config.privateKey))
  }
  // Send Tx
  return signedTxPromise
    .then((signedResult) => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(config.url)
    })
    .then((res) => {
      // Parse result
      if (res.result === true) {
        res.txid = signedTx.hash
      }
      return res
    })
}
