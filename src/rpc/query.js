import axios from 'axios'
import { serializeTransaction } from '../transactions'
import { DEFAULT_REQ } from '../consts'
import logger from '../logging'
import { timeout } from '../settings'

const log = logger('rpc')

/**
 * @typedef RPCRequest
 * @property {string} method - RPC Method to call.
 * @property {any[]} params - Parameters to pass to RPC method.
 * @property {number} id - ID of this request. Will be passed back in response.
 */
/**
 * @class Query
 * @classdesc
 * A Query object helps us to construct and record requests
 * @param {RPCRequest} req - Request object
 */
class Query {
  constructor (req) {
    /**
     * The request object.
     * @type {object}
     */
    this.req = Object.assign({}, DEFAULT_REQ, req)
    /**
     * If this request has been completed.
     * @type {boolean}
     * @default false
     */
    this.completed = false
    /**
     * Optional parsing function for the response.
     * @type {function}
     * @default null
     */
    this.parse = null
  }

  get [Symbol.toStringTag] () {
    return 'Query'
  }

  /**
   * Attaches a parser method to the Query. This method will be used to parse the response.
   * @param {function} parser
   * @return {this}
   */
  parseWith (parser) {
    this.parse = parser
    return this
  }

  /**
   * Executes the Query by sending the RPC request to the provided net.
   * @param {string} url - The URL of the node.
   * @param {AxiosRequestConfig} config - Request configuration
   * @return {Response|any}
   */
  execute (url, config = {}) {
    if (this.completed) throw new Error('This request has been sent')
    return queryRPC(url, this.req, config)
      .then((res) => {
        this.res = res
        this.completed = true
        if (res.error) {
          throw new Error(res.error.message)
        }
        if (this.parse) {
          log.info(`Query[${this.req.method}] successful`)
          return this.parse(res)
        }
        return res
      })
  }

  /**
   * @param {string} addr
   * @return {Query}
   */
  static getAccountState (addr) {
    return new Query({
      method: 'getaccountstate',
      params: [addr]
    })
  }

  /**
   * @param {string} assetId
   * @return {Query}
   */
  static getAssetState (assetId) {
    return new Query({
      method: 'getassetstate',
      params: [assetId]
    })
  }

  /**
   * @param {string|number} indexOrHash
   * @param {number} verbose
   * @return {Query}
   */
  static getBlock (indexOrHash, verbose = 1) {
    return new Query({
      method: 'getblock',
      params: [indexOrHash, verbose]
    })
  }

  /**
   * @param {number} index
   * @return {Query}
   */
  static getBlockHash (index) {
    return new Query({
      method: 'getblockhash',
      params: [index]
    })
  }

  /**
   * @return {Query}
   */
  static getBestBlockHash () {
    return new Query({
      method: 'getbestblockhash'
    })
  }

  /**
   * @return {Query}
   */
  static getBlockCount () {
    return new Query({
      method: 'getblockcount'
    })
  }

  /**
   * @param {number} index
   * @return {Query}
   */
  static getBlockSysFee (index) {
    return new Query({
      method: 'getblocksysfee',
      params: [index]
    })
  }

  /**
   * @return {Query}
   */
  static getConnectionCount () {
    return new Query({
      method: 'getconnectioncount'
    })
  }
  /**
   * @param {string} scriptHash
   * @return {Query}
   */
  static getContractState (scriptHash) {
    return new Query({
      method: 'getcontractstate',
      params: [scriptHash]
    })
  }

  /**
   * @return {Query}
   */
  static getPeers () {
    return new Query({
      method: 'getpeers'
    })
  }

  /**
   * @return {Query}
   */
  static getRawMemPool () {
    return new Query({
      method: 'getrawmempool'
    })
  }

  /**
   * @param {string} txid
   * @param {number} verbose
   * @return {Query}
   */
  static getRawTransaction (txid, verbose = 1) {
    return new Query({
      method: 'getrawtransaction',
      params: [txid, verbose]
    })
  }

  /**
   * @param {string} scriptHash
   * @param {string} key
   * @return {Query}
   */
  static getStorage (scriptHash, key) {
    return new Query({
      method: 'getstorage',
      params: [scriptHash, key]
    })
  }

  /**
   * @param {string} txid
   * @param {number} index
   * @return {Query}
   */
  static getTxOut (txid, index) {
    return new Query({
      method: 'gettxout',
      params: [txid, index]
    })
  }

  /**
   * @return {Query}
   */
  static getVersion () {
    return new Query({
      method: 'getversion'
    })
  }

  /**
   * @param {string} scriptHash
   * @param {Array} params
   * @return {Query}
   */
  static invoke (scriptHash, ...params) {
    return new Query({
      method: 'invoke',
      params: [scriptHash, params]
    })
  }

  /**
   * @param {string} scriptHash
   * @param {string} operation
   * @param {Array} params
   * @return {Query}
   */
  static invokeFunction (scriptHash, operation, ...params) {
    return new Query({
      method: 'invokefunction',
      params: [scriptHash, operation, params]
    })
  }

  /**
   * @param {string} script
   */
  static invokeScript (script) {
    return new Query({
      method: 'invokescript',
      params: [script]
    })
  }

  /**
   * @param {Transaction|string} transaction
   * @return {Query}
   */
  static sendRawTransaction (transaction) {
    const serialized = typeof (transaction) === 'object' ? serializeTransaction(transaction) : transaction
    return new Query({
      method: 'sendrawtransaction',
      params: [serialized]
    })
  }

  /**
   * @param {string} block
   * @return {Query}
   */
  static submitBlock (block) {
    return new Query({
      method: 'submitblock',
      params: [block]
    })
  }

  /**
   * @param {string} addr
   * @return {Query}
   */
  static validateAddress (addr) {
    return new Query({
      method: 'validateaddress',
      params: [addr]
    })
  }
}

export default Query

/**
 * Wrapper for querying node RPC
 * @param {string} url - Node URL.
 * @param {object} req - The request object.
 * @param {string} req.method - RPC Method name.
 * @param {Array} req.params - Array of parameters to send.
 * @param {number} req.id - Unique id to identity yourself. RPC should reply with same id.
 * @param {AxiosRequestConfig} config - Configuration to pass down to axios
 * @returns {Promise<Response>} RPC Response
 */
export const queryRPC = (url, req, config = {}) => {
  const jsonRequest = axios.create({
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: timeout.rpc
  })
  const jsonRpcData = Object.assign({}, DEFAULT_REQ, req)
  return jsonRequest.post(url, jsonRpcData, config).then((response) => {
    return response.data
  })
}
