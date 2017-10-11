import Query from './query'
import { isAddress, serializeTransaction } from '../wallet'
import semver from 'semver'

const LATEST_VERSION = '2.3.3'

export class RPCClient {
  constructor (net, version = LATEST_VERSION) {
    if (net === 'MainNet') {
      this.net = 'http://seed1.neo.org:10332'
    } else if (this.net === 'TestNet') {
      this.net = 'http://seed1.neo.org:20332'
    } else {
      this.net = net
    }
    this.history = []
    this.version = semver.clean(version)
  }

  /**
   * Takes an Query object and executes it.
   * @param {Query} query
   * @return {Promise<any>}
   */
  execute (query) {
    this.history.push(query)
    return query.execute(this.net)
  }

  /**
   * Creates a query with the given req and immediately executes it.
   * @param {Object} req
   * @return {Promise<any>}
   */
  query (req) {
    const query = new Query(this.net, req)
    return this.execute(query)
  }

  /**
   * @param {string} addr
   * @return {Promise<Object>}
   */
  getAccountState (addr) {
    if (!isAddress(addr)) throw new Error(`Invalid address given: ${addr}`)
    const req = { method: 'getaccountstate', params: [addr] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} assetId
   * @return {Promise<Object>}
   */
  getAssetState (assetId) {
    const req = { method: 'getassetstate', params: [assetId] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string|number} indexOrHash
   * @return {Promise<Block>}
   */
  getBlock (indexOrHash, verbose = 1) {
    const req = { method: 'getblock', params: [indexOrHash, verbose] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  getBestBlockHash () {
    const req = { method: 'getbestblockhash' }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {Promise<number>}
   */
  getBlockCount () {
    const req = { method: 'getblockcount' }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {number} index
   */
  getBlockSysFee (index) {
    const req = { method: 'getblocksysfee', params: [index] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {number}
   */
  getConnectionCount () {
    const req = { method: 'getconnectioncount' }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} scriptHash
   * @return {Promise<Object>}
   */
  getContractState (scriptHash) {
    const req = { method: 'getcontractstate', params: [scriptHash] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {Promise<Object>}
   */
  getPeers () {
    const req = { method: 'getpeers' }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {Promise<string[]>}
   */
  getRawMemPool () {
    const req = { method: 'getrawmempool' }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} txid
   * @param {number} verbose
   * @param {Promise<string|object>}
   */
  getRawTransaction (txid, verbose = 1) {
    const req = { method: 'getrawtransaction', params: [txid, verbose] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} scriptHash
   * @param {string} key
   * @return {string} value
   */
  getStorage (scriptHash, key) {
    const req = { method: 'getstorage', params: [scriptHash, key] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} txid
   * @param {number} index
   * @param {}
   */
  getTxOut (txid, index) {

  }

  /**
   * @param {string} scriptHash
   * @param {Array} params
   */
  invoke (scriptHash, params) {
    if (semver.lt(this.version, '2.3.3')) throw new Error(`This method is not implemented for this version`)
    const req = { method: 'invoke', params }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} scriptHash
   * @param {string} operation
   * @param {Array} params
   */
  invokeFunction (scriptHash, operation, params) {
    if (semver.lt(this.version, '2.3.3')) throw new Error(`This method is not implemented for this version`)
    const req = { method: 'invokefunction', params: [operation, ...params] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} script
   */
  invokeScript (script) {
    if (semver.lt(this.version, '2.3.3')) throw new Error(`This method is not implemented for this version`)
    const req = { method: 'invokescript', params: [script] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {Transaction|string} transaction
   * @return {boolean}
   */
  sendRawTransaction (transaction) {
    const tx = typeof (transaction) === 'object' ? serializeTransaction(transaction) : transaction
    const req = { method: 'sendrawtransaction', params: [tx] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} block
   */
  submitBlock (block) {
    const req = { method: 'submitblock', params: [block] }
    return this.query(req)
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} addr
   * @return {boolean}
   */
  validateAddress (addr) {
    const req = { method: 'validateAddress', params: [addr] }
    return this.query(req)
      .then((res) => {
        return res.result.isvalid
      })
  }
}
