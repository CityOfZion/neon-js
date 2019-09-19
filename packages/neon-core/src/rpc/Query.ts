import axios, { AxiosRequestConfig } from "axios";
import { DEFAULT_REQ } from "../consts";
import { compareArray } from "../helper";
import logger from "../logging";
import { timeout } from "../settings";
import { Transaction } from "../tx";

const log = logger("rpc");

export interface RPCRequest {
  method: string;
  params: any[];
  id: number;
}

export interface RPCResponse {
  jsonrpc: string;
  id: number;
  result: any;
  error?: RPCErrorResponse;
}

export interface RPCErrorResponse {
  code: number;
  message: string;
}

/**
 * Wrapper for querying node RPC
 * @param url Node URL.
 * @param req RPC Request object.
 * @param config Configuration to pass down to axios
 * @returns RPC Response
 */
export async function queryRPC(
  url: string,
  req: Partial<RPCRequest>,
  config: AxiosRequestConfig = {}
): Promise<RPCResponse> {
  const body = Object.assign({}, DEFAULT_REQ, req);
  const conf = Object.assign(
    {
      headers: { "Content-Type": "application/json" },
      timeout: timeout.rpc
    },
    config
  );
  const response = await axios.post(url, body, conf);
  return response.data;
}

/**
 * A Query object helps us to construct and record requests
 */
export class Query {
  /**
   * This Query returns the hash of the highest block.
   */
  public static getBestBlockHash(): Query {
    return new Query({
      method: "getbestblockhash"
    });
  }

  /**
   * This Query returns the specified block either as a hexstring or human readable JSON.
   * @param indexOrHash height or hash of block.
   * @param verbose 0 for hexstring, 1 for JSON. Defaults to 0.
   */
  public static getBlock(
    indexOrHash: string | number,
    verbose: 0 | 1 = 0
  ): Query {
    return new Query({
      method: "getblock",
      params: [indexOrHash, verbose]
    });
  }

  /**
   * This Query returns the current block height.
   */
  public static getBlockCount(): Query {
    return new Query({
      method: "getblockcount"
    });
  }

  /**
   * This Query returns the hash of a specific block.
   * @param {number} index height of block.
   */
  public static getBlockHash(index: number): Query {
    return new Query({
      method: "getblockhash",
      params: [index]
    });
  }

  /**
   * This Query Returns the corresponding block header information according to the specified script hash.
   * @param indexOrHash height or hash of block.
   * @param verbose Optional, the default value of verbose is 0. When verbose is 0, the serialized information of the block is returned, represented by a hexadecimal string. If you need to get detailed information, you will need to use the SDK for deserialization. When verbose is 1, detailed information of the corresponding block in Json format string, is returned.
   */
  public static getBlockHeader(
    indexOrHash: string | number,
    verbose: 0 | 1 = 0
  ): Query {
    return new Query({
      method: "getblockheader",
      params: [indexOrHash, verbose]
    });
  }

  /**
   * This Query returns the amount of GAS burnt as fees within a specific block.
   * @param index height of block.
   */
  public static getBlockSysFee(index: number): Query {
    return new Query({
      method: "getblocksysfee",
      params: [index]
    });
  }

  /**
   * This Query returns the number of other nodes that this node is connected to.
   */
  public static getConnectionCount(): Query {
    return new Query({
      method: "getconnectioncount"
    });
  }
  /**
   * This Query returns information about the smart contract registered at the specific hash.
   * @param scriptHash hash of contract
   */
  public static getContractState(scriptHash: string): Query {
    return new Query({
      method: "getcontractstate",
      params: [scriptHash]
    });
  }

  /**
   * This Query returns the list of nodes that this node is connected to.
   */
  public static getPeers(): Query {
    return new Query({
      method: "getpeers"
    });
  }

  /**
   * This Query returns the transaction hashes of the transactions confirmed or unconfirmed.
   * @param shouldGetUnverified Optional. Default is 0.
   * shouldGetUnverified = 0, get confirmed transaction hashes
   * shouldGetUnverified = 1, get current block height and confirmed and unconfirmed tx hash
   */
  public static getRawMemPool(shouldGetUnverified: 0 | 1 = 0): Query {
    return new Query({
      method: "getrawmempool",
      params: [shouldGetUnverified]
    });
  }

  /**
   * This Query returns information about a specific transaction in either hexstring or human readable JSON.
   * @param txid hash of the specific transaction.
   * @param verbose 0 for hexstring, 1 for JSON. Defaults to 0.
   */
  public static getRawTransaction(txid: string, verbose: number = 0): Query {
    return new Query({
      method: "getrawtransaction",
      params: [txid, verbose]
    });
  }

  /**
   * This Query returns the raw value stored at the specific key under a specific contract.
   * @param scriptHash hash of contract.
   * @param key
   */
  public static getStorage(scriptHash: string, key: string): Query {
    return new Query({
      method: "getstorage",
      params: [scriptHash, key]
    });
  }

  /**
   * This Query returns the block index in which the transaction is found.
   * @param txid hash of the specific transaction.
   */
  public static getTransactionHeight(txid: string): Query {
    return new Query({
      method: "gettransactionheight",
      params: [txid]
    });
  }

  /**
   * Gets the list of candidates available for voting.
   * @return List of validators
   */
  public static getValidators(): Query {
    return new Query({
      method: "getvalidators"
    });
  }

  /**
   * This Query returns the node version.
   */
  public static getVersion(): Query {
    return new Query({
      method: "getversion"
    });
  }

  /**
   * This Query invokes the VM to run the specific contract with the provided operation and params. Do note that this function only suits contracts with a Main(string, args[]) entry method.
   * @param scriptHash hash of contract to test.
   * @param operation name of operation to call (first argument)
   * @param params parameters to pass (second argument)
   */
  public static invokeFunction(
    scriptHash: string,
    operation: string,
    ...params: any[]
  ): Query {
    return new Query({
      method: "invokefunction",
      params: [scriptHash, operation, params]
    });
  }

  /**
   * This Query runs the specific script through the VM.
   * @param script
   */
  public static invokeScript(script: string) {
    return new Query({
      method: "invokescript",
      params: [script]
    });
  }

  /**
   * This Query returns a list of plugins loaded by the node.
   */
  public static listPlugins(): Query {
    return new Query({
      method: "listplugins",
      params: []
    });
  }

  /**
   * This Query transmits the specific transaction to the node.
   * @param transaction Transaction as a Transaction object or hexstring.
   */
  public static sendRawTransaction(transaction: Transaction | string): Query {
    const serialized =
      transaction instanceof Transaction
        ? transaction.serialize(true)
        : transaction;
    return new Query({
      method: "sendrawtransaction",
      params: [serialized]
    });
  }

  /**
   * This Query submits a block for processing.
   * @param block
   */
  public static submitBlock(block: string): Query {
    return new Query({
      method: "submitblock",
      params: [block]
    });
  }

  /**
   * This Query submits an address for validation.
   * @param addr Address to validate.
   */
  public static validateAddress(addr: string): Query {
    return new Query({
      method: "validateaddress",
      params: [addr]
    });
  }

  public req: RPCRequest;
  public res: any;
  public completed: boolean;
  public parse?: (res: any) => any;

  public get id(): number {
    return this.req.id;
  }
  public get method(): string {
    return this.req.method;
  }

  public get params(): any[] {
    return this.req.params;
  }

  public constructor(req: Partial<RPCRequest>) {
    this.req = Object.assign({}, DEFAULT_REQ, req);
    this.completed = false;
  }

  public get [Symbol.toStringTag](): string {
    return "Query";
  }

  /**
   * Attaches a parser method to the Query. This method will be used to parse the response.
   */
  public parseWith(parser: (res: any) => any): this {
    this.parse = parser;
    return this;
  }

  /**
   * Executes the Query by sending the RPC request to the provided net.
   * @param url The URL of the node.
   * @param config Request configuration
   */
  public async execute(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<any> {
    if (this.completed) {
      return Promise.reject("This request has been sent");
    }
    const response = await queryRPC(url, this.req, config);
    this.res = response;
    this.completed = true;
    if (response.error) {
      return Promise.reject(`${url}: ${response.error.message}`);
    }
    if (this.parse) {
      log.info(`Query[${this.req.method}] successful`);
      return this.parse(response.result);
    }
    return response;
  }

  public export(): RPCRequest {
    return Object.assign({}, this.req, {
      params: this.req.params.map(p => {
        if (typeof p === "object") {
          return JSON.parse(JSON.stringify(p));
        }
        return p;
      })
    });
  }

  public equals(other: Partial<RPCRequest>): boolean {
    return (
      this.req.id === other.id &&
      this.req.method === other.method &&
      compareArray(this.req.params, other.params || [])
    );
  }
}

export default Query;
