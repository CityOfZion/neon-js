
/** Format of request object sent to node for RPC call */
export interface RPCRequest {
  method: string,
  params: Array<any>,
  id: number
}

/** Response returned from node RPC call */
export interface RPCResponse {
  jsonrpc: string,
  id: number,
  result: any
}
