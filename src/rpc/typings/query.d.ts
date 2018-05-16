import { Transaction } from '../../transactions/index'
import { RPCRequest, RPCResponse } from './rpc'
import { AxiosRequestConfig } from 'axios';

/**
* A Query object helps us to construct and record requests
*/
export class Query {
  constructor(req: RPCRequest)

  /** Attaches a parser method to the Query. This method will be used to parse the response. */
  parseWith(parser: Function): this

  /** Executes the Query by sending the RPC request to the provided net. */
  execute(url: string, config?: AxiosRequestConfig): Promise<RPCResponse | any>

  /** Gets the state of an account given an address. */
  static getAccountState(addr: string): Query

  /** Gets the state of an asset given an id. */
  static getAssetState(assetId: string): Query

  /** Gets the block hash at a given height. */
  static getBlock(indexOrHash: string | number, verbose?: number): Query

  /** Gets the block hash at a given height. */
  static getBlockHash(index: number): Query

  /** Get the latest block hash. */
  static getBestBlockHash(): Query

  /** Get the current block height. */
  static getBlockCount(): Query

  /** Get the system fees of a block. */
  static getBlockSysFee(index: number): Query

  /** Gets the number of peers this node is connected to. */
  static getConnectionCount(): Query

  /** Gets the state of the contract at the given scriptHash. */
  static getContractState(scriptHash: string): Query

  /** Gets a list of all peers that this node has discovered. */
  static getPeers(): Query

  /** Gets a list of all transaction hashes waiting to be processed. */
  static getRawMemPool(): Query

  /** Gets a transaction based on its hash. */
  static getRawTransaction(txid: string, verbose?: number): Query

  /** Gets the corresponding value of a key in the storage of a contract address. */
  static getStorage(scriptHash: string, key: string): Query

  /** Gets the transaction output given a transaction id and index */
  static getTxOut(txid: string, index: number): Query

  /** Gets the version of the NEO node. This method will never be blocked by version. This method will also update the current Client's version to the one received. */
  static getVersion(): Query

  /** Calls a smart contract with the given parameters. This method is a local invoke, results are not reflected on the blockchain. */
  static invoke(scriptHash: string, params: Array<any>): Query

  /** Submits a contract method call with parameters for the node to run. This method is a local invoke, results are not reflected on the blockchain. */
  static invokeFunction(scriptHash: string, operation: string, params: Array<any>): Query

  /** Submits a script for the node to run. This method is a local invoke, results are not reflected on the blockchain. */
  static invokeScript(script: string): Query

  /** Sends a serialized transaction to the network. */
  static sendRawTransaction(transaction: Transaction | string): Query

  /** Submits a serialized block to the network. */
  static submitBlock(block: string): Query

  /** Checks if the provided address is a valid NEO address. */
  static validateAddress(addr: string): Query
}

export function queryRPC(url: string, req: RPCRequest, config?: AxiosRequestConfig): Promise<any>
