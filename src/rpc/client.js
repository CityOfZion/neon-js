import Query from './query'
import { isAddress } from '../wallet'
import semver from 'semver'
import { RPC_VERSION, DEFAULT_RPC, NEO_NETWORK } from '../consts'

const versionRegex = /NEO:(\d+\.\d+\.\d+)/
/**
 * @class RPCClient
 * @classdesc
 * RPC Client model to query a NEO node. Contains built-in methods to query using RPC calls.
 * @param {string} net - 'MainNet' or 'TestNet' will query the default RPC address found in consts. You may provide a custom URL.
 * @param {string} version - Version of NEO node. Used to check if RPC methods have been implemented. it will default to DEFAULT_RPC found in CONST
 */
class RPCClient {
  constructor (net, version = RPC_VERSION) {
    /**
     * @type {string}
     * The URL of the node that this client queries.
     */
    if (net === NEO_NETWORK.MAIN) {
      this.net = DEFAULT_RPC.MAIN
    } else if (net === NEO_NETWORK.TEST) {
      this.net = DEFAULT_RPC.TEST
    } else {
      this.net = net
    }
    /**
     * @type {Query[]}
     * History of queries made with this client.
     */
    this.history = []

    if (semver.valid(version)) {
      /**
      * @type {string}
      * Version of this client. Used to check if RPC call is implemented.
      */
      this.version = semver.clean(version)
    } else {
      throw new Error(`Invalid Version: ${version}`)
    }
  }

  /**
   * Takes an Query object and executes it. Adds the Query object to history.
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
    const query = new Query(req)
    return this.execute(query)
  }

  /**
   * Gets the state of an account given an address.
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
   * Gets the block at a given height or hash.
   * @param {string|number} indexOrHash
   * @return {Promise<Object|string>}
   */
  getBlock (indexOrHash, verbose = 1) {
    return this.execute(Query.getBlock(indexOrHash, verbose))
      .then((res) => {
        return res.result
      })
  }

  /**
   * Get the latest block hash.
   * @return {Promise<string>}
   */
  getBestBlockHash () {
    return this.execute(Query.getBestBlockHash())
      .then((res) => {
        return res.result
      })
  }

  /**
   * Get the current block height.
   * @return {Promise<number>}
   */
  getBlockCount () {
    return this.execute(Query.getBlockCount())
      .then((res) => {
        return res.result
      })
  }

  /**
   * Get the system fees of a block.
   * @param {number} index
   */
  getBlockSysFee (index) {
    return this.execute(Query.getBlockSysFee(index))
      .then((res) => {
        return res.result
      })
  }

  /**
   * Gets the number of peers this node is connected to.
   * @return {number}
   */
  getConnectionCount () {
    return this.execute(Query.getConnectionCount())
      .then((res) => {
        return res.result
      })
  }

  /**
   * Gets the state of the contract at the given scriptHash.
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
   * Gets a list of all peers that this node has discovered.
   * @return {Promise<Object>}
   */
  getPeers () {
    return this.execute(Query.getPeers())
      .then((res) => {
        return res.result
      })
  }

  /**
   * Gets a list of all transaction hashes waiting to be processed.
   * @return {Promise<string[]>}
   */
  getRawMemPool () {
    return this.execute(Query.getRawMemPool())
      .then((res) => {
        return res.result
      })
  }

  /**
   * Gets a transaction based on its hash.
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
   * Gets the corresponding value of a key in the storage of a contract address.
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
   * Gets the version of the NEO node. This method will never be blocked by version. This method will also update the current Client's version to the one received.
   */
  getVersion () {
    return this.execute(Query.getVersion())
      .then((res) => {
        const version = res.result.useragent.match(versionRegex)[1]
        this.version = semver.clean(version)
        return this.version
      })
      .catch((err) => {
        if (err.message.includes('Method not found')) {
          this.version = RPC_VERSION
        } else {
          throw err
        }
      })
  }
  /**
   * Calls a smart contract with the given parameters. This method is a local invoke, results are not reflected on the blockchain.
   * @param {string} scriptHash
   * @param {Array} params
   */
  invoke (scriptHash, params) {
    if (semver.lt(this.version, '2.3.3')) return Promise.reject(new Error(`This method is not implemented for this version`))
    return this.execute(Query.invoke(scriptHash, params))
      .then((res) => {
        return res.result
      })
  }

  /**
   * Submits a contract method call with parameters for the node to run. This method is a local invoke, results are not reflected on the blockchain.
   * @param {string} scriptHash
   * @param {string} operation
   * @param {Array} params
   */
  invokeFunction (scriptHash, operation, params) {
    if (semver.lt(this.version, '2.3.3')) return Promise.reject(new Error(`This method is not implemented for this version`))
    return this.execute(Query.invokeFunction(scriptHash, operation, params))
      .then((res) => {
        return res.result
      })
  }

  /**
   * Submits a script for the node to run. This method is a local invoke, results are not reflected on the blockchain.
   * @param {string} script
   */
  invokeScript (script) {
    if (semver.lt(this.version, '2.3.3')) return Promise.reject(new Error(`This method is not implemented for this version`))
    return this.execute(Query.invokeScript(script))
      .then((res) => {
        return res.result
      })
  }

  /**
   * Sends a serialized transaction to the network.
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
   * Submits a serialized block to the network.
   * @param {string} block
   */
  submitBlock (block) {
    return this.execute(Query.submitBlock(block))
      .then((res) => {
        return res.result
      })
  }

  /**
   * Checks if the provided address is a valid NEO address.
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

export default RPCClient
