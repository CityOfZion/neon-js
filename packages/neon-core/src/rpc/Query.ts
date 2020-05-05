import { DEFAULT_REQ } from "../consts";
import {
  Transaction,
  TransactionAttributeLike,
  CosignerLike,
  WitnessLike,
} from "../tx";
import { ContractManifestLike, StackItemLike } from "../sc";
import { BlockJson, Validator, BlockHeaderJson } from "../types";

export type BooleanLikeParam = 0 | 1 | boolean;
export interface QueryLike<T extends unknown[]> {
  method: string;
  params: T;
  id: number;
  jsonrpc: "2.0";
}

export interface RPCResponse<T> {
  jsonrpc: string;
  id: number;
  result: T;
  error?: RPCErrorResponse;
}

export interface RPCErrorResponse {
  code: number;
  message: string;
}

/**
 * Result from calling invokescript or invokefunction.
 */
export interface InvokeResult {
  /** The script that is sent for execution on the blockchain. This is a hexstring. */
  script: string;
  /** State of VM on exit. HALT means a successful exit while FAULT means exit with error. */
  state: "HALT" | "FAULT";
  /** Amount of gas consumed up to the point of stopping in the VM. If state is FAULT, this value is not representative of the amount of gas it will consume if it somehow succeeds on the blockchain. */
  gas_consumed: string;
  stack: StackItemLike[];
}

export interface GetContractStateResult {
  /** 0x prefixed hexstring */
  hash: string;
  script: string;
  manifest: ContractManifestLike;
}

export interface GetPeersResult {
  unconnected: NodePeer[];
  bad: NodePeer[];
  connected: NodePeer[];
}

export interface GetRawMemPoolResult {
  height: number;
  verified: string[];
  unverified: string[];
}

export interface GetRawTransactionResult {
  hash: string;
  size: number;
  version: number;
  nonce: number;
  sender: string;
  sys_fee: string;
  net_fee: string;
  valid_until_block: number;
  attributes: TransactionAttributeLike[];
  cosigners: CosignerLike[];
  script: string;
  witnesses: WitnessLike[];
  blockhash: string;
  /** Number of blocks that has been confirmed between blocktime and now. */
  confirmations: number;
  /** Unix timestamp in milliseconds. */
  blocktime: number;
}

export interface GetVersionResult {
  tcp_port: number;
  ws_port: number;
  nonce: number;
  user_agent: string;
}

export interface NodePeer {
  /** IPv4 Address */
  address: string;
  port: number;
}
export interface CliPlugin {
  name: string;
  version: string;
  interfaces: string[];
}

export interface SendResult {
  /** 0x prefixed hexstring */
  hash: string;
}
export interface ValidateAddressResult {
  address: string;
  isvalid: boolean;
}

/**
 * A Query object helps us to construct and record requests for the Neo node RPC. For each RPC endpoint, the equivalent static method is camelcased. Each Query object can only be used once.
 *
 * @example
 * const q1 = Query.getBestBlockHash();
 */
export class Query<TParams extends unknown[], TResponse> {
  /**
   * This Query returns the hash of the highest block.
   */
  public static getBestBlockHash(): Query<[], string> {
    return new Query({
      method: "getbestblockhash",
    });
  }

  /**
   * This Query returns the specified block either as a hexstring or human readable JSON.
   * @param indexOrHash height or hash of block.
   * @param verbose 0 for hexstring, 1 for JSON. Defaults to 0.
   */
  public static getBlock(
    indexOrHash: number | string,
    verbose: 1 | true
  ): Query<[number | string, 1 | true], BlockJson>;
  public static getBlock(
    indexOrHash: number | string,
    verbose?: 0 | false
  ): Query<[number | string, 0 | false], string>;
  public static getBlock(
    indexOrHash: number | string,
    verbose: BooleanLikeParam = 0
  ): Query<[number | string, BooleanLikeParam], string | BlockJson> {
    return new Query({
      method: "getblock",
      params: [indexOrHash, verbose],
    });
  }

  /**
   * This Query returns the current block height.
   */
  public static getBlockCount(): Query<[], number> {
    return new Query({
      method: "getblockcount",
      params: [],
    });
  }

  /**
   * This Query returns the hash of a specific block.
   * @param {number} index height of block.
   */
  public static getBlockHash(index: number): Query<[number], string> {
    return new Query({
      method: "getblockhash",
      params: [index],
    });
  }

  /**
   * This Query Returns the corresponding block header information according to the specified script hash.
   * @param indexOrHash height or hash of block.
   * @param verbose Optional, the default value of verbose is 0. When verbose is 0, the serialized information of the block is returned, represented by a hexadecimal string. If you need to get detailed information, you will need to use the SDK for deserialization. When verbose is 1, detailed information of the corresponding block in Json format string, is returned.
   */
  public static getBlockHeader(
    indexOrHash: string | number,
    verbose: 1 | true
  ): Query<[string | number, 1 | true], BlockHeaderJson>;
  public static getBlockHeader(
    indexOrHash: string | number,
    verbose?: 0 | false
  ): Query<[string | number, 0 | false], string>;
  public static getBlockHeader(
    indexOrHash: string | number,
    verbose: BooleanLikeParam = 0
  ): Query<[string | number, BooleanLikeParam], string | BlockHeaderJson> {
    return new Query({
      method: "getblockheader",
      params: [indexOrHash, verbose],
    });
  }

  /**
   * This Query returns the number of other nodes that this node is connected to.
   */
  public static getConnectionCount(): Query<[], number> {
    return new Query({
      method: "getconnectioncount",
    });
  }

  /**
   * This Query returns information about the smart contract registered at the specific hash.
   * @param scriptHash hash of contract
   */
  public static getContractState(
    scriptHash: string
  ): Query<[string], GetContractStateResult> {
    return new Query({
      method: "getcontractstate",
      params: [scriptHash],
    });
  }

  /**
   * This Query returns the list of nodes that this node is connected to.
   */
  public static getPeers(): Query<[], GetPeersResult> {
    return new Query({
      method: "getpeers",
    });
  }

  /**
   * This Query returns the transaction hashes of the transactions confirmed or unconfirmed.
   * @param shouldGetUnverified Optional. Default is 0.
   *
   * shouldGetUnverified = 0, get confirmed transaction hashes
   *
   * shouldGetUnverified = 1, get current block height and confirmed and unconfirmed tx hash
   */
  public static getRawMemPool(
    shouldGetUnverified?: BooleanLikeParam
  ): Query<[0 | false], string[]>;
  public static getRawMemPool(
    shouldGetUnverified: 1 | true
  ): Query<[1], GetRawMemPoolResult>;
  public static getRawMemPool(
    shouldGetUnverified: BooleanLikeParam = 0
  ): Query<[BooleanLikeParam], string[] | GetRawMemPoolResult> {
    return new Query({
      method: "getrawmempool",
      params: [shouldGetUnverified],
    });
  }

  /**
   * This Query returns information about a specific transaction in either hexstring or human readable JSON.
   * @param txid hash of the specific transaction.
   * @param verbose 0 for hexstring, 1 for JSON. Defaults to 0.
   */
  public static getRawTransaction(
    txid: string,
    verbose?: 0 | false
  ): Query<[string, 0 | false], string>;
  public static getRawTransaction(
    txid: string,
    verbose: 1 | true
  ): Query<[string, 1 | true], GetRawTransactionResult>;
  public static getRawTransaction(
    txid: string,
    verbose: BooleanLikeParam = 0
  ): Query<[string, BooleanLikeParam], string | GetRawTransactionResult> {
    return new Query({
      method: "getrawtransaction",
      params: [txid, verbose],
    });
  }

  /**
   * This Query returns the raw value stored at the specific key under a specific contract.
   * @param scriptHash hash of contract.
   * @param key
   */
  public static getStorage(
    scriptHash: string,
    key: string
  ): Query<[string, string], string> {
    return new Query({
      method: "getstorage",
      params: [scriptHash, key],
    });
  }

  /**
   * This Query returns the block index in which the transaction is found.
   * @param txid hash of the specific transaction.
   */
  public static getTransactionHeight(txid: string): Query<[string], number> {
    return new Query({
      method: "gettransactionheight",
      params: [txid],
    });
  }

  /**
   * Gets the list of candidates available for voting.
   * @return List of validators
   */
  public static getValidators(): Query<[], Validator[]> {
    return new Query({
      method: "getvalidators",
    });
  }

  /**
   * This Query returns the node version.
   */
  public static getVersion(): Query<[], GetVersionResult> {
    return new Query({
      method: "getversion",
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
    params: unknown[] = []
  ): Query<[string, string, unknown[]], InvokeResult> {
    return new Query({
      method: "invokefunction",
      params: [scriptHash, operation, params],
    });
  }

  /**
   * This Query runs the specific script through the VM.
   * @param script
   */
  public static invokeScript(script: string): Query<[string], InvokeResult> {
    return new Query({
      method: "invokescript",
      params: [script],
    });
  }

  /**
   * This Query returns a list of plugins loaded by the node.
   */
  public static listPlugins(): Query<[], CliPlugin[]> {
    return new Query({
      method: "listplugins",
      params: [],
    });
  }

  /**
   * This Query transmits the specific transaction to the node. On success, the node will return the transaction hash.
   * @param transaction Transaction as a Transaction object or hexstring.
   */
  public static sendRawTransaction(
    transaction: Transaction | string
  ): Query<[string], SendResult> {
    const serialized =
      transaction instanceof Transaction
        ? transaction.serialize(true)
        : transaction;
    return new Query({
      method: "sendrawtransaction",
      params: [serialized],
    });
  }

  /**
   * This Query submits a block for processing.
   * @param block
   */
  public static submitBlock(block: string): Query<[string], SendResult> {
    return new Query({
      method: "submitblock",
      params: [block],
    });
  }

  /**
   * This Query submits an address for validation.
   * @param addr Address to validate.
   */
  public static validateAddress(
    addr: string
  ): Query<[string], ValidateAddressResult> {
    return new Query({
      method: "validateaddress",
      params: [addr],
    });
  }

  public id: number;
  public method: string;
  public params: TParams;

  public constructor(req: Partial<QueryLike<TParams>>) {
    this.id = req?.id ?? DEFAULT_REQ.id;
    this.method = req?.method ?? DEFAULT_REQ.method;
    this.params = (req?.params ?? []) as TParams;
  }

  public get [Symbol.toStringTag](): string {
    return "Query";
  }

  public export(): QueryLike<TParams> {
    return {
      params: this.params,
      jsonrpc: "2.0",
      id: this.id,
      method: this.method,
    };
  }

  public equals(other: Partial<QueryLike<TParams>>): boolean {
    return (
      this.id === other.id &&
      this.method === other.method &&
      this.params.length === (other.params ?? []).length &&
      this.params.every((val, ind) => (other.params ?? [])[ind] === val)
    );
  }
}

export default Query;
