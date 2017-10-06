import axios from 'axios'
import { getAccountFromWIFKey, getScriptHashFromAddress } from './wallet'
import * as tx from './transactions/index.js'

import _ from 'lodash'

// hard-code asset ids for NEO and GAS
export const neoId = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
export const gasId = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
export const allAssetIds = [neoId, gasId]

/**
 * @typedef {Object} Coin
 * @property {number} index - Index in list.
 * @property {string} txid - Transaction ID which produced this coin.
 * @property {number} value - Value of this coin.
 */

/**
 * @typedef {Object} Balance
 * @property {{balance: number, unspent: Coin[]}} NEO Amount of NEO in address
 * @property {{balance: number, unspent: Coin[]}} GAS Amount of GAS in address
 * @property {string} address - The Address that was queried
 * @property {string} net - 'MainNet' or 'TestNet'
 */

/**
 * @typedef {Object} History
 * @property {string} address - Address.
 * @property {string} name - API name.
 * @property {string} net - 'MainNet' or 'TestNet'
 * @property {PastTx[]} history - List of past transactions.
 */

/**
 * @typedef {Object} PastTx
 * @property {number} GAS - Gas involved.
 * @property {number} NEO - NEO involved.
 * @property {number} block_index - Block index.
 * @property {boolean} gas_sent - Was GAS sent.
 * @property {boolean} neo_sent - Was NEO sent.
 * @property {string} txid - Transaction ID.
 */
/**
 * @typedef {Object} Response
 * @property {string} jsonrpc - JSON-RPC Version
 * @property {number} id - Unique ID.
 * @property {any} result - Result
*/

/**
 * Perform a ClaimTransaction for all available GAS
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} fromWif - WIF key of address you are claiming from.
 * @return {Promise<Response>} RPC response from sending transaction
 */
export const doClaimAllGas = (net, fromWif) => {
  const apiEndpoint = getAPIEndpoint(net)
  const account = getAccountFromWIFKey(fromWif)
  // TODO: when fully working replace this with mainnet/testnet switch
  return axios.get(apiEndpoint + '/v2/address/claims/' + account.address).then((response) => {
    const unsignedTx = tx.create.claim(account.publicKeyEncoded, response.data)
    const signedTx = tx.signTransaction(unsignedTx, account.privateKey)
    const hexTx = tx.serializeTransaction(signedTx)
    return queryRPC(net, 'sendrawtransaction', [hexTx], 2)
  })
}

/**
 * Lookup key in SC storage
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} scriptHash of SC
 * @return {Promise<Response>} RPC response looking up key from storage
 */
export const getStorage = (net, scriptHash, key) => {
  return queryRPC(net, 'getstorage', [scriptHash, key])
}

/**
 * Send an asset to an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} toAddress - The destination address.
 * @param {string} fromWif - The WIF key of the originating address.
 * @param {{NEO: number, GAS: number}} amount - The amount of each asset (NEO and GAS) to send, leave empty for 0.
 * @return {Promise<Response>} RPC Response
 */
export const doSendAsset = (net, toAddress, fromWif, assetAmounts) => {
  const account = getAccountFromWIFKey(fromWif)
  const toScriptHash = getScriptHashFromAddress(toAddress)
  return getBalance(net, account.address).then((balances) => {
    // TODO: maybe have transactions handle this construction?
    const intents = _.map(assetAmounts, (v, k) => {
      return { assetId: tx.ASSETS[k], value: v, scriptHash: toScriptHash }
    })
    const unsignedTx = tx.create.contract(account.publicKeyEncoded, balances, intents)
    const signedTx = tx.signTransaction(unsignedTx, account.privateKey)
    const hexTx = tx.serializeTransaction(signedTx)
    return queryRPC(net, 'sendrawtransaction', [hexTx], 4)
  })
}

/**
 * Call mintTokens for RPX
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} fromWif - The WIF key of the originating address.
 * @param {neo} amount - The amount of neo to send to RPX.
 * @param {gasCost} amount - The Gas to send as SC fee.
 * @return {Promise<Response>} RPC Response
 */
export const doMintTokens = (net, fromWif, neo, gasCost) => {
  const RPX = '5b7074e873973a6ed3708862f219a6fbf4d1c411'
  const account = getAccountFromWIFKey(fromWif)
  return getBalance(net, account.address).then((balances) => {
    // TODO: maybe have transactions handle this construction?
    const intents = [
      { assetId: tx.ASSETS['NEO'], value: neo, scriptHash: RPX }
    ]
    const invoke = { operation: 'mintTokens', scriptHash: RPX }
    const unsignedTx = tx.create.invocation(account.publicKeyEncoded, balances, intents, invoke, gasCost, { version: 1 })
    const signedTx = tx.signTransaction(unsignedTx, account.privateKey)
    const hexTx = tx.serializeTransaction(signedTx)
    return queryRPC(net, 'sendrawtransaction', [hexTx], 4)
  })
}

/**
 * Sends a Transaction.
 * @param {string} net - 'MainNet' or 'TestNet'
 * @param {string|Object} transaction - Serialized hexstring or Transaction Object.
 * @param {Promise<Response>}
 */
export const doSendTx = (net, transaction, id = 42) => {
  let txString = typeof (transaction) === 'object' ? tx.serializeTransaction(transaction) : transaction
  return queryRPC(net, 'sendrawtransaction', [txString], id)
}

/**
 * API Switch for MainNet and TestNet
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {string} URL of API endpoint.
 */
export const getAPIEndpoint = (net) => {
  if (net === 'MainNet') {
    return 'http://api.wallet.cityofzion.io'
  } else {
    return 'http://testnet-api.wallet.cityofzion.io'
  }
}

/**
 * Get balances of NEO and GAS for an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Balance>} Balance of address
 */
export const getBalance = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/balance/' + address)
    .then((res) => {
      return res.data
      // const neo = res.data.NEO.balance
      // const gas = res.data.GAS.balance
      // return { Neo: neo, Gas: gas, unspent: { Neo: res.data.NEO.unspent, Gas: res.data.GAS.unspent } }
    })
}

/**
 * Get amounts of available (spent) and unavailable claims
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<{available: number, unavailable: number}>} An Object with available and unavailable GAS amounts.
 */
export const getClaimAmounts = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/claims/' + address).then((res) => {
    return { available: parseInt(res.data.total_claim), unavailable: parseInt(res.data.total_unspent_claim) }
  })
}

/**
 * Returns the best performing (highest block + fastest) node RPC
 * @param {string} net - 'MainNet' or 'TestNet' or a custom URL.
 * @return {Promise<string>} The URL of the best performing node or the custom URL provided.
 */
export const getRPCEndpoint = (net) => {
  if (net !== 'TestNet' && net !== 'MainNet') return net
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/network/best_node').then((response) => {
    return response.data.node
  })
}

/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<History>} History
 */
export const getTransactionHistory = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/history/' + address).then((response) => {
    return response.data.history
  })
}

/**
 * Get the current height of the light wallet DB
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<number>} Current height.
 */
export const getWalletDBHeight = (net) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/block/height').then((response) => {
    return parseInt(response.data.block_height)
  })
}

/**
 * Wrapper for querying node RPC
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} method - RPC Method name.
 * @param {Array} params - Array of parameters to send.
 * @param {number} id - Unique id to identity yourself. RPC should reply with same id.
 * @returns {Promise<Response>} RPC Response
 */
export const queryRPC = (net, method, params, id = 1) => {
  const jsonRequest = axios.create({ headers: { 'Content-Type': 'application/json' } })
  const jsonRpcData = { method, params, id, jsonrpc: '2.0' }
  return getRPCEndpoint(net).then((rpcEndpoint) => {
    return jsonRequest.post(rpcEndpoint, jsonRpcData).then((response) => {
      return response.data
    })
  })
}

export const testInvokeRPC = (script) => {
  const jsonRequest = axios.create({ headers: { 'Content-Type': 'application/json' } })
  const jsonRpcData = { method: 'invokescript', params: [script], id: 1, jsonrpc: '2.0' }
  return jsonRequest.post('http://test1.cityofzion.io:8880/', jsonRpcData).then((response) => {
    return response.data
  })
}
