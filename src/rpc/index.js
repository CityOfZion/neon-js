import RPCClient from './client'
import Query, { queryRPC } from './query'
import Network from './Network'

/**
 * @typedef {object} RPCResponse
 * @property {string} jsonrpc - JSON-RPC Version
 * @property {number} id - Unique ID.
 * @property {any} result - Result
 * @property {string} [txid] - Transaction hash of the successful transaction. Only available when result is true.
*/

export default {
  create: {
    rpcClient: (net) => new RPCClient(net),
    query: (req) => new Query(req)
  }
}

export { RPCClient, Query, Network, queryRPC }
export * from './parse'
