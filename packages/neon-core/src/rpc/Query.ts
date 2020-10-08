import { DEFAULT_REQ } from "../consts";
import { Transaction, TransactionJson, Signer, SignerJson } from "../tx";
import { ContractManifestLike, ContractParam, StackItemJson } from "../sc";
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

export interface ApplicationLog {
  txid: string;
  trigger: string;
  vmstate: string;
  gasconsumed: string;
  stack?: StackItemJson[];
  notifications: {
    contract: string;
    eventname: string;
    state: string;
  }[];
}

export type GetApplicationLogsResult = ApplicationLog[];

/**
 * Result from calling invokescript or invokefunction.
 */
export interface InvokeResult {
  /** The script that is sent for execution on the blockchain. This is a hexstring. */
  script: string;
  /** State of VM on exit. HALT means a successful exit while FAULT means exit with error. */
  state: "HALT" | "FAULT";
  /** Amount of gas consumed up to the point of stopping in the VM. If state is FAULT, this value is not representative of the amount of gas it will consume if it somehow succeeds on the blockchain. */
  gasconsumed: string;
  stack: StackItemJson[];
  tx?: unknown;
}

export interface GetContractStateResult {
  /** 0x prefixed hexstring */
  hash: string;
  script: string;
  manifest: ContractManifestLike;
}

export interface GetNep5TransfersResult {
  sent: Nep5TransferEvent[];
  received: Nep5TransferEvent[];
  address: string;
}

export interface Nep5TransferEvent {
  timestamp: number;
  assethash: string;
  transferaddress: string;
  amount: string;
  blockindex: number;
  transfernotifyindex: number;
  txhash: string;
}

export interface GetNep5BalancesResult {
  address: string;
  balance: {
    assethash: string;
    amount: string;
    lastupdatedblock: number;
  }[];
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

export interface GetRawTransactionResult extends TransactionJson {
  hash: string;
  blockhash: string;
  /** Number of blocks that has been confirmed between blocktime and now. */
  confirmations: number;
  /** Unix timestamp in milliseconds. */
  blocktime: number;
  vm_state: "HALT" | "FAULT";
}

export interface GetVersionResult {
  tcpport: number;
  wsport: number;
  nonce: number;
  useragent: string;
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

export interface UnclaimedGasResult {
  unclaimed: string;
  address: string;
}

/**
 * A Query object helps us to construct and record requests for the Neo node RPC. For each RPC endpoint, the equivalent static method is camelcased. Each Query object can only be used once.
 *
 * @example
 * const q1 = Query.getBestBlockHash();
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
   * Query returning the application log.
   */
  public static getApplicationLogs(
    hash: string
  ): Query<[string], GetApplicationLogsResult> {
    return new Query({
      method: "getapplicationlogs",
      params: [hash],
    });
  }

  /**
   * This Query returns the specified block either as a hexstring or human readable JSON.
   * @param indexOrHash - height or hash of block.
   * @param verbose - 0 for hexstring, 1 for JSON. Defaults to 0.
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
   * @param index - height of block.
   */
  public static getBlockHash(index: number): Query<[number], string> {
    return new Query({
      method: "getblockhash",
      params: [index],
    });
  }

  /**
   * This Query Returns the corresponding block header information according to the specified script hash.
   * @param indexOrHash - height or hash of block.
   * @param verbose - Optional, the default value of verbose is 0. When verbose is 0, the serialized information of the block is returned, represented by a hexadecimal string. If you need to get detailed information, you will need to use the SDK for deserialization. When verbose is 1, detailed information of the corresponding block in Json format string, is returned.
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
   * @param scriptHash - hash of contract
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
   * Query returning the nep5 transfer history of an account. Defaults of 1 week of history.
   * @param accountIdentifer - address or scriptHash of account
   * @param startTime - millisecond Unix timestamp
   * @param endTime - millisecond Unix timestamp
   */
  public static getNep5Transfers(
    accountIdentifer: string,
    startTime?: string,
    endTime?: string
  ): Query<[string, string?, string?], GetNep5TransfersResult> {
    const params: [string, string?, string?] = [accountIdentifer];
    if (startTime) params.push(startTime);
    if (endTime) params.push(endTime);
    return new Query({
      method: "getnep5transfers",
      params,
    });
  }

  /**
   * Query returning the nep5 balance of an account.
   * @param accountIdentifer - address or scriptHash of account
   */
  public static getNep5Balances(
    accountIdentifer: string
  ): Query<[string], GetNep5BalancesResult> {
    return new Query({
      method: "getnep5balances",
      params: [accountIdentifer],
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
   * @param shouldGetUnverified - Optional. Default is 0.
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
   * @param txid - hash of the specific transaction.
   * @param verbose - 0 for hexstring, 1 for JSON. Defaults to 0.
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
   * @param scriptHash - hash of contract.
   * @param key - the storage key
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
   * @param txid - hash of the specific transaction.
   */
  public static getTransactionHeight(txid: string): Query<[string], number> {
    return new Query({
      method: "gettransactionheight",
      params: [txid],
    });
  }

  /**
   * Gets the list of candidates available for voting.
   * @returns list of validators
   */
  public static getValidators(): Query<[], Validator[]> {
    return new Query({
      method: "getvalidators",
    });
  }

  /**
   * Returns the node version.
   */
  public static getVersion(): Query<[], GetVersionResult> {
    return new Query({
      method: "getversion",
    });
  }

  /**
   * This Query invokes the VM to run the specific contract with the provided operation and params. Do note that this function only suits contracts with a Main(string, args[]) entry method.
   * @param scriptHash - hash of contract to test.
   * @param operation - name of operation to call (first argument)
   * @param params - parameters to pass (second argument). ContractParam objects will be exported to JSON format.
   * @param signers - scripthashes of witnesses that should sign the transaction containing this script. Signers will be exported to JSON format.
   */
  public static invokeFunction(
    scriptHash: string,
    operation: string,
    params: unknown[] = [],
    signers: (Signer | SignerJson)[] = []
  ): Query<[string, string, unknown[], SignerJson[]], InvokeResult> {
    return new Query({
      method: "invokefunction",
      params: [
        scriptHash,
        operation,
        params.map((p) => (p instanceof ContractParam ? p.export() : p)),
        signers.map((s) => (s instanceof Signer ? s.toJson() : s)),
      ],
    });
  }

  /**
   * This Query runs the specific script through the VM.
   * @param script -VM script as a hexstring.
   * @param signers - scripthashes of witnesses that should sign the transaction containing this script.
   */
  public static invokeScript(
    script: string,
    signers: (Signer | SignerJson)[] = []
  ): Query<[string, SignerJson[]], InvokeResult> {
    return new Query({
      method: "invokescript",
      params: [
        script,
        signers.map((s) => (s instanceof Signer ? s.toJson() : s)),
      ],
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
   * @param transaction - transaction as a Transaction object or hexstring.
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
   * @param block - a serialized block
   */
  public static submitBlock(block: string): Query<[string], SendResult> {
    return new Query({
      method: "submitblock",
      params: [block],
    });
  }

  /**
   * This Query submits an address for validation.
   * @param addr - address to validate.
   */
  public static validateAddress(
    addr: string
  ): Query<[string], ValidateAddressResult> {
    return new Query({
      method: "validateaddress",
      params: [addr],
    });
  }

  public static getUnclaimedGas(
    addr: string
  ): Query<[string], UnclaimedGasResult> {
    return new Query({
      method: "getunclaimedgas",
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
