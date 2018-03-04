import { Transaction } from '../../transactions/index'
import { RPCRequest, RPCResponse } from './rpc'

/**
* A Query object helps us to construct and record requests
*/
export class Query {
  constructor(req: RPCRequest)

  /**
   * Attaches a parser method to the Query. This method will be used to parse the response.
   */
  parseWith(parser: Function): this

  /**
   * Executes the Query by sending the RPC request to the provided net.
   */
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
