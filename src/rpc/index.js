import RPCClient from './client'
import Query, { queryRPC } from './query'

export default {
  create: {
    rpcClient: (net) => new RPCClient(net),
    query: (req) => new Query(req)
  }
}

export { RPCClient, Query, queryRPC }
export * from './parse'
