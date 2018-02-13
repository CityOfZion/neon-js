import { Transaction } from '../transactions/index'

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


//client
export class RPCClient {
  constructor(net: string, version: string)

  execute(query: Query): Promise<any>
  query(req: RPCRequest): Promise<any>
  getAccountState(addr: string): Promise<any>
  getAssetState(assetId: string): Promise<any>
  getBlock(indexOrHash: string | number, verbose?: number): Promise<object | string>
  getBlockHash(index: number): Promise<string>
  getBestBlockHash(): Promise<string>
  getBlockCount(): Promise<number>
  getBlockSysFee(index: number): Promise<string>
  getConnectionCount(): Promise<number>
  getContractState(scriptHash: string): Promise<object>
  getPeers(): Promise<object>
  getRawMemPool(): Promise<string[]>
  getRawTransaction(txid: string, verbose?: number): Promise<string | object>
  getStorage(scriptHash: string, key: string): Promise<string>
  getTxOut(txid: string, index: number): Promise<object>
  getVersion(): Promise<string>
  invoke(scriptHash: string, params: Array<any>): Promise<object>
  invokeFunction(scriptHash: string, operation: string, params: Array<any>): Promise<object>
  invokeScript(script: string): Promise<object>
  sendRawTransaction(transaction: Transaction | string): Promise<boolean>
  submitBlock(block: string): Promise<any>
  validateAddress(addr: string): Promise<boolean>
}

//parse
export function VMParser(res: RPCResponse): Array<any>
export function VMExtractor(res: RPCResponse): Array<any>
export function VMZip(args: any[]): (res: RPCResponse) => any[]

//query
export class Query {
  constructor(req: RPCRequest)

  parseWith(parser: Function): this
  execute(url: string): Promise<RPCResponse | any>

  static getAccountState(addr: string): Query
  static getAssetState(assetId: string): Query
  static getBlock(indexOrHash: string | number, verbose?: number): Query
  static getBlockHash(index: number): Query
  static getBestBlockHash(): Query
  static getBlockCount(): Query
  static getBlockSysFee(index: number): Query
  static getConnectionCount(): Query
  static getContractState(scriptHash: string): Query
  static getPeers(): Query
  static getRawMemPool(): Query
  static getRawTransaction(txid: string, verbose?: number): Query
  static getStorage(scriptHash: string, key: string): Query
  static getTxOut(txid: string, index: number): Query
  static getVersion(): Query
  static invoke(scriptHash: string, params: Array<any>): Query
  static invokeFunction(scriptHash: string, operation: string, params: Array<any>): Query
  static invokeScript(script: string): Query
  static sendRawTransaction(transaction: Transaction | string): Query
  static submitBlock(block: string): Query
  static validateAddress(addr: string): Query
}

export function queryRPC(urrl: string, req: RPCRequest): Promise<any>

