import axios from 'axios'
import { serializeTransaction } from '../wallet'
const DEFAULT_REQ = { jsonrpc: '2.0', method: 'getblockcount', params: [], id: 1234 }

/**
 * A Query object helps us to construct and record requests
 */
export class Query {
  constructor (req) {
    this.req = Object.assign({}, DEFAULT_REQ, req)
    this.completed = false
  }

  parseWith (parser) {
    this.parse = parser
    return this
  }

  execute (net) {
    if (this.completed) throw new Error(`This request has been sent`)
    return queryRPC(net, this.req)
      .then((res) => {
        this.res = res
        this.completed = true
        if (res.error) {
          throw new Error(res.error.message)
        }
        if (this.parse) {
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
   * @param {string} scriptHash
   * @param {Array} params
   * @return {Query}
   */
  static invoke (scriptHash, params) {
    return new Query({
      method: 'invoke',
      params: [scriptHash, ...params]
    })
  }

  /**
   * @param {string} scriptHash
   * @param {string} operation
   * @param {Array} params
   * @return {Query}
   */
  static invokeFunction (scriptHash, operation, params) {
    return new Query({
      method: 'invokefunction',
      params: [scriptHash, operation, ...params]
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
      method: 'validateAddress',
      params: [addr]
    })
  }
}

/**
 * Wrapper for querying node RPC
 * @param {string} url - Node URL.
 * @param {string} method - RPC Method name.
 * @param {Array} params - Array of parameters to send.
 * @param {number} id - Unique id to identity yourself. RPC should reply with same id.
 * @returns {Promise<Response>} RPC Response
 */
export const queryRPC = (url, req) => {
  const jsonRequest = axios.create({ headers: { 'Content-Type': 'application/json' } })
  const jsonRpcData = Object.assign({}, DEFAULT_REQ, req)
  return jsonRequest.post(url, jsonRpcData).then((response) => {
    return response.data
  })
}
