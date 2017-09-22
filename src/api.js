import axios from 'axios'
import { getAccountFromWIFKey, transferTransaction, signatureData, addContract, claimTransaction } from './wallet'

// hard-code asset ids for NEO and GAS
export const neoId = 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
export const gasId = '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'
export const allAssetIds = [neoId, gasId]

// switch between APIs for MainNet and TestNet
export const getAPIEndpoint = (net) => {
  if (net === 'MainNet') {
    return 'http://api.wallet.cityofzion.io'
  } else {
    return 'http://testnet-api.wallet.cityofzion.io'
  }
}

/**
 * Returns the best performing (highest block + fastest) node RPC
 * @param {string} net - 'MainNet' or 'TestNet'
 * @return {Promise<string>} The URL of the best performing node
 */
export const getRPCEndpoint = (net) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/network/best_node').then((response) => {
    return response.data.node
  })
}

/**
 * Wrapper for querying node RPC
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} method - RPC Method name.
 * @param {Array} params - Array of parameters to send.
 * @param {number} id - Unique id to identity yourself. RPC should reply with same id.
 * @returns {object} RPC Response
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

/**
 * Get amounts of available (spent) and unavailable claims
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {object} { available: <number>, unavailable: <number> }
 */
export const getClaimAmounts = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/claims/' + address).then((res) => {
    return { available: parseInt(res.data.total_claim), unavailable: parseInt(res.data.total_unspent_claim) }
  })
}

/**
 * Perform a ClaimTransaction for all available GAS
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} fromWif - WIF key of address you are claiming from.
 * @return {object} RPC response from sending transaction
 */
export const doClaimAllGas = (net, fromWif) => {
  const apiEndpoint = getAPIEndpoint(net)
  const account = getAccountFromWIFKey(fromWif)
  // TODO: when fully working replace this with mainnet/testnet switch
  return axios.get(apiEndpoint + '/v2/address/claims/' + account.address).then((response) => {
    const claims = response.data['claims']
    const totalClaim = response.data['total_claim']
    const txData = claimTransaction(claims, account.publickeyEncoded, account.address, totalClaim)
    const sign = signatureData(txData, account.privatekey)
    const txRawData = addContract(txData, sign, account.publickeyEncoded)
    return queryRPC(net, 'sendrawtransaction', [txRawData], 2)
  })
}

// get Neo and Gas balance for an account
/**
 * Get balances of NEO and GAS for an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {object} Object in the form of:
 * {
 *  Neo: {},
 *  Gas: {},
 *  unspent: {
 *    Neo: Coin[],
 *    Gas: Coin[]
 *  }
 * }
 */
export const getBalance = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/balance/' + address)
    .then((res) => {
      const neo = res.data.NEO.balance
      const gas = res.data.GAS.balance
      return { Neo: neo, Gas: gas, unspent: { Neo: res.data.NEO.unspent, Gas: res.data.GAS.unspent } }
    })
}

/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Object} History
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
 * @return {number} Current height.
 */
export const getWalletDBHeight = (net) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/block/height').then((response) => {
    return parseInt(response.data.block_height)
  })
}

/**
 * Send an asset to an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} toAddress - The destination address.
 * @param {string} fromWif - The WIF key of the originating address.
 * @param {string} assetType - The Asset. 'Neo' or 'Gas'.
 * @param {number} amount - The amount of asset to send.
 * @return {Object} RPC Response
 */
export const doSendAsset = (net, toAddress, fromWif, assetType, amount) => {
  let assetId
  if (assetType === 'Neo') {
    assetId = neoId
  } else {
    assetId = gasId
  }
  const fromAccount = getAccountFromWIFKey(fromWif)
  return getBalance(net, fromAccount.address).then((response) => {
    const coinsData = {
      'assetid': assetId,
      'list': response.unspent[assetType],
      'balance': response[assetType],
      'name': assetType
    }
    const txData = transferTransaction(coinsData, fromAccount.publickeyEncoded, toAddress, amount)
    const sign = signatureData(txData, fromAccount.privateKey)
    const txRawData = addContract(txData, sign, fromAccount.publicKeyEncoded)
    return queryRPC(net, 'sendrawtransaction', [txRawData], 4)
  })
}
