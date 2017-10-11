import Query from './query'
import { isAddress } from '../wallet'
import semver from 'semver'

const LATEST_VERSION = '2.3.2'

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
    return this.execute(Query.getAccountState(addr))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} assetId
   * @return {Promise<Object>}
   */
  getAssetState (assetId) {
    return this.execute(Query.getAssetState(assetId))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string|number} indexOrHash
   * @return {Promise<Object|string>}
   */
  getBlock (indexOrHash, verbose = 1) {
    return this.execute(Query.getblock(indexOrHash, verbose))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {Promise<string>}
   */
  getBestBlockHash () {
    return this.execute(Query.getBestBlockHash())
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {Promise<number>}
   */
  getBlockCount () {
    return this.execute(Query.getBlockCount())
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {number} index
   */
  getBlockSysFee (index) {
    return this.execute(Query.getBlockSysFee(index))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {number}
   */
  getConnectionCount () {
    return this.execute(Query.getConnectionCount())
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} scriptHash
   * @return {Promise<Object>}
   */
  getContractState (scriptHash) {
    return this.execute(Query.getContractState(scriptHash))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {Promise<Object>}
   */
  getPeers () {
    return this.execute(Query.getPeers())
      .then((res) => {
        return res.result
      })
  }

  /**
   * @return {Promise<string[]>}
   */
  getRawMemPool () {
    return this.execute(Query.getRawMemPool())
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
    return this.execute(Query.getRawTransaction(txid, verbose))
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
    return this.execute(Query.getStorage(scriptHash, key))
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
    return this.execute(Query.getTxOut(txid, index))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} scriptHash
   * @param {Array} params
   */
  invoke (scriptHash, params) {
    if (semver.lt(this.version, '2.3.3')) throw new Error(`This method is not implemented for this version`)
    return this.execute(Query.invoke(scriptHash, params))
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
    return this.execute(Query.invokeFunction(scriptHash, operation, params))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} script
   */
  invokeScript (script) {
    if (semver.lt(this.version, '2.3.3')) throw new Error(`This method is not implemented for this version`)
    return this.execute(Query.invokeScript(script))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {Transaction|string} transaction
   * @return {boolean}
   */
  sendRawTransaction (transaction) {
    return this.execute(Query.sendRawTransaction(transaction))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} block
   */
  submitBlock (block) {
    return this.execute(Query.submitBlock(block))
      .then((res) => {
        return res.result
      })
  }

  /**
   * @param {string} addr
   * @return {boolean}
   */
  validateAddress (addr) {
    return this.execute(Query.validateAddress(addr))
      .then((res) => {
        return res.result.isvalid
      })
  }
}
