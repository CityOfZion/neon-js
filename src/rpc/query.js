import axios from 'axios'

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
