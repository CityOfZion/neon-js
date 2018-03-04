export interface RPCRequest {
  method: string,
  params: Array<any>,
  id: number
}

export interface RPCResponse {
  jsonrpc: string,
  id: number,
  result: any
}
