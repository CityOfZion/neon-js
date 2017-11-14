import axios from 'axios'
import { Account } from '../wallet'
import { Transaction } from '../transactions'
import { Query } from '../rpc'
import { ASSET_ID } from '../consts'

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
 * @property {string} [txid] - Transaction hash of the successful transaction. Only available when result is true.
*/

/**
 * API Switch for MainNet and TestNet
 * @param {string} net - 'MainNet', 'TestNet', or custom neon-wallet-db URL.
 * @return {string} URL of API endpoint.
 */
export const getAPIEndpoint = (net) => {
  switch (net) {
    case 'MainNet':
      return 'http://api.wallet.cityofzion.io'
    case 'TestNet':
      return 'http://testnet-api.wallet.cityofzion.io'
    default:
      return net
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
    })
}

/**
 * Get amounts of available (spent) and unavailable claims.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Claim>} An Object with available and unavailable GAS amounts.
 */
export const getClaimAmounts = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/claims/' + address).then((res) => {
    return res.data
  })
}

/**
 * Returns the best performing (highest block + fastest) node RPC.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<string>} The URL of the best performing node.
 */
export const getRPCEndpoint = (net) => {
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
 * Perform a ClaimTransaction for all available GAS based on API
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} privateKey - Private Key or WIF.
 * @param {function} [signingFunction] - Optional async signing function. Used for external signing.
 * @return {Promise<Response>} RPC response from sending transaction
 */
export const doClaimAllGas = (net, privateKey, signingFunction) => {
  const account = new Account(privateKey)
  const rpcEndpointPromise = getRPCEndpoint(net)
  const claimsPromise = getClaimAmounts(net, account.address)
  let signedTx // Scope this outside so that all promises have this
  let endpt
  return Promise.all([rpcEndpointPromise, claimsPromise])
    .then((values) => {
      endpt = values[0]
      const claims = values[1]
      if (claims.length === 0) throw new Error('No claimable gas!')
      const unsignedTx = Transaction.createClaimTx(account.publicKey, claims)
      if (signingFunction) {
        return signingFunction(unsignedTx, account.publicKey)
      } else {
        return unsignedTx.sign(account.privateKey)
      }
    })
    .then((signedResult) => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then((res) => {
      if (res.result === true) {
        res.txid = signedTx
      }
      return res
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
export const doMintTokens = (net, scriptHash, fromWif, neo, gasCost, signingFunction) => {
  const account = new Account(fromWif)
  const intents = [{ assetId: ASSET_ID.NEO, value: neo, scriptHash: scriptHash }]
  const invoke = { operation: 'mintTokens', scriptHash }
  const rpcEndpointPromise = getRPCEndpoint(net)
  const balancePromise = getBalance(net, account.address)
  let signedTx
  let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then((values) => {
      endpt = values[0]
      let balances = values[1]
      const unsignedTx = Transaction.createInvocationTx(balances, intents, invoke, gasCost, { version: 1 })
      if (signingFunction) {
        return signingFunction(unsignedTx, account.publicKey)
      } else {
        unsignedTx.sign(account.privateKey)
      }
    })
    .then((signedResult) => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then((res) => {
      if (res.result === true) {
        res.txid = signedTx.hash
      }
      return res
    })
}
/**
 * Send an asset to an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} toAddress - The destination address.
 * @param {string} from - Private Key or WIF of the sending address.
 * @param {{NEO: number, GAS: number}} assetAmounts - The amount of each asset (NEO and GAS) to send, leave empty for 0.
 * @param {function} [signingFunction] - Optional signing function. Used for external signing.
 * @return {Promise<Response>} RPC Response
 */
export const doSendAsset = (net, toAddress, from, assetAmounts, signingFunction) => {
  const fromAcct = new Account(from)
  const toAcct = new Account(toAddress)
  const rpcEndpointPromise = getRPCEndpoint(net)
  const balancePromise = getBalance(net, fromAcct.address)
  const intents = Object.keys(assetAmounts).map((key) => {
    return { assetId: ASSET_ID[key], value: assetAmounts[key], scriptHash: toAcct.scriptHash }
  })
  let signedTx
  let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then((values) => {
      endpt = values[0]
      const balance = values[1]
      const unsignedTx = Transaction.createContractTx(balance, intents)
      if (signingFunction) {
        return signingFunction(unsignedTx, fromAcct.publicKey)
      } else {
        return unsignedTx.sign(fromAcct.privateKey)
      }
    })
    .then((signedResult) => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then((res) => {
      if (res.result === true) {
        res.txid = signedTx.hash
      }
      return res
    })
}

export default {
  get: {
    APIEndPoint: getAPIEndpoint,
    RPCEndPoint: getRPCEndpoint,
    claimAmounts: getClaimAmounts,
    balance: getBalance,
    walletDBHeight: getWalletDBHeight,
    transactionHistory: getTransactionHistory
  },
  do: {
    sendAsset: doSendAsset,
    claimAllGas: doClaimAllGas,
    mintTokens: doMintTokens
  }
}
