import { DEFAULT_REQ } from "../consts";
import { Transaction, TransactionJson, Signer, SignerJson } from "../tx";
import {
  ContractManifestJson,
  ContractParam,
  StackItemJson,
  NEFJson,
  StackItem,
} from "../sc";
import { BlockJson, Validator, BlockHeaderJson } from "../types";
import { HexString } from "../u";
import { isEqual } from "lodash";

export type JsonRpcParams = unknown[] | Record<string | number, unknown>;
export type BooleanLikeParam = 0 | 1 | boolean;
export interface QueryLike<T extends JsonRpcParams> {
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

export interface ApplicationLogJson {
  txid: string;
  executions: {
    trigger: string;
    vmstate: string;
    gasconsumed: string;
    stack?: StackItemJson[];
    notifications: {
      contract: string;
      eventname: string;
      state: StackItemJson;
    }[];
  }[];
}

/**
 * Result from calling invokescript or invokefunction.
 */
export interface InvokeResult<T extends StackItemJson = StackItemJson> {
  /** The script that is sent for execution on the blockchain as a base64 string. */
  script: string;
  /** State of VM on exit. HALT means a successful exit while FAULT means exit with error. */
  state: "HALT" | "FAULT";
  /** Amount of gas consumed up to the point of stopping in the VM. If state is FAULT, this value is not representative of the amount of gas it will consume if it somehow succeeds on the blockchain.
   * This is a decimal value.
   */
  gasconsumed: string;
  /** A human-readable string clarifying the exception that occurred. Only available when state is "FAULT". */
  exception: string | null;
  stack: T[];
  /** A ready to send transaction that wraps the script.
   * Only available when signers are provided and the sender's private key is open in the RPC node.
   * Formatted in base64-encoding.
   */
  tx?: string;
  session?: string;
}

export interface GetContractStateResult {
  id: number;
  updatecounter: number;
  /** 0x prefixed hexstring */
  hash: string;
  /** Base64 encoded string */
  nef: NEFJson;
  manifest: ContractManifestJson;
}

export interface NativeContractState {
  id: number;
  hash: string;
  nef: NEFJson;
  manifest: ContractManifestJson;
  updatehistory: number[];
}

export interface GetNep11BalancesResult {
  /* Base58-encoded string */
  address: string;
  balance: {
    /* 0x-prefixed scripthash of the contract. */
    assethash: string;
    tokens: { tokenid: string; amount: string; lastupdatedblock: number }[];
  }[];
}

export interface GetNep11TransfersResult {
  address: string;
  sent: Nep11TransferEvent[];
  received: Nep11TransferEvent[];
}

export interface Nep11TransferEvent {
  timestamp: number;
  assethash: string;
  transferaddress: string;
  amount: string;
  blockindex: number;
  transfernotifyindex: number;
  txhash: string;
  tokenid: string;
}

export interface GetNep17TransfersResult {
  sent: Nep17TransferEvent[];
  received: Nep17TransferEvent[];
  address: string;
}

export interface Nep17TransferEvent {
  timestamp: number;
  assethash: string;
  transferaddress: string;
  amount: string;
  blockindex: number;
  transfernotifyindex: number;
  txhash: string;
}

export interface GetNep17BalancesResult {
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
  protocol: {
    addressversion: number;
    network: number;
    validatorscount: number;
    msperblock: number;
    maxtraceableblocks: number;
    maxvaliduntilblockincrement: number;
    maxtransactionsperblock: number;
    memorypoolmaxtransactions: number;
    initialgasdistribution: number;
  };
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

export interface GetUnclaimedGasResult {
  unclaimed: string;
  address: string;
}
export interface FindStorageResult {
  truncated: boolean;
  next: number;
  results: {
    key: string;
    value: string;
  }[];
}

function transformInputTransaction(
  tx: Transaction | HexString | string
): string {
  return tx instanceof Transaction
    ? HexString.fromHex(tx.serialize(true)).toBase64()
    : tx instanceof HexString
    ? tx.toBase64()
    : tx;
}

/**
 * Type guard for narrowing down to an object.
 * @returns
 */
function isJsonRpcParamRecord(
  i?: JsonRpcParams
): i is Record<string | number, unknown> {
  return i !== undefined && i !== null && typeof i === "object";
}

/**
 * A Query object helps us to construct and record requests for the Neo node RPC. For each RPC endpoint, the equivalent static method is camelcased. Each Query object can only be used once.
 *
 * @example
 * const q1 = Query.getBestBlockHash();
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Query<TParams extends JsonRpcParams, TResponse> {
  /**
   * Query returning the Iterator value from session and Iterator id returned by invokefunction or invokescript.
   * @param sessionId - Cache id. It is session returned by invokefunction or invokescript.
   * @param iteratorId - Iterator data id. It is the id of stack returned by invokefunction or invokescript .
   * @param count - The number of values returned. It cannot exceed the value of the MaxIteratorResultItems field in config.json of the RpcServer plug-in.
   * The result is the first count of data traversed in the Iterator, and follow-up requests will continue traversing from count + 1 .
   */
  public static traverseIterator(
    sessionId: string,
    iteratorId: string,
    count: number
  ): Query<[string, string, number], StackItem[]> {
    return new Query({
      method: "traverseiterator",
      params: [sessionId, iteratorId, count],
    });
  }

  /**
   * Query returning the network fee required for a given transaction.
   */
  public static calculateNetworkFee(
    tx: Transaction | HexString | string
  ): Query<[string], { networkfee: string }> {
    const base64Tx = transformInputTransaction(tx);
    return new Query({ method: "calculatenetworkfee", params: [base64Tx] });
  }
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
  public static getApplicationLog(
    hash: string
  ): Query<[string], ApplicationLogJson> {
    return new Query({
      method: "getapplicationlog",
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
   * This Query returns the list of public keys in the current committee.
   */
  public static getCommittee(): Query<[], string[]> {
    return new Query({
      method: "getcommittee",
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
   * This Query returns all the native contracts state.
   */
  public static getNativeContracts(): Query<[], NativeContractState[]> {
    return new Query({
      method: "getnativecontracts",
    });
  }

  public static getNep11Balances(
    accountIdentifier: string
  ): Query<[string], GetNep11BalancesResult> {
    return new Query({
      method: "getnep11balances",
      params: [accountIdentifier],
    });
  }

  public static getNep11Properties(
    contractHash: string,
    tokenId: string
  ): Query<[string, string], Record<string, unknown>> {
    return new Query({
      method: "getnep11properties",
      params: [contractHash, tokenId],
    });
  }

  public static getNep11Transfers(
    accountIdentifer: string,
    startTime?: string,
    endTime?: string
  ): Query<[string, string?, string?], GetNep11TransfersResult> {
    const params: [string, string?, string?] = [accountIdentifer];
    if (startTime) params.push(startTime);
    if (endTime) params.push(endTime);
    return new Query({
      method: "getnep17transfers",
      params,
    });
  }

  /**
   * Query returning the Nep17 transfer history of an account. Defaults of 1 week of history.
   * @param accountIdentifer - address or scriptHash of account
   * @param startTime - millisecond Unix timestamp
   * @param endTime - millisecond Unix timestamp
   */
  public static getNep17Transfers(
    accountIdentifer: string,
    startTime?: string,
    endTime?: string
  ): Query<[string, string?, string?], GetNep17TransfersResult> {
    const params: [string, string?, string?] = [accountIdentifer];
    if (startTime) params.push(startTime);
    if (endTime) params.push(endTime);
    return new Query({
      method: "getnep17transfers",
      params,
    });
  }

  /**
   * Query returning the Nep17 balance of an account.
   * @param accountIdentifer - address or scriptHash of account
   */
  public static getNep17Balances(
    accountIdentifer: string
  ): Query<[string], GetNep17BalancesResult> {
    return new Query({
      method: "getnep17balances",
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
   * This Query returns the value stored at the specific key under a specific contract in base64 format.
   * @param scriptHash - hash of contract.
   * @param key - the storage key in as hex string
   */
  public static getStorage(
    scriptHash: string,
    key: string
  ): Query<[string, string], string> {
    return new Query({
      method: "getstorage",
      params: [scriptHash, HexString.fromHex(key).toBase64()],
    });
  }

  /**
   * This Query returns the keys and values stored with a specific key prefix under a specific contract.
   * @param scriptHash - contract script hash
   * @param searchPrefix - prefix to search for
   * @param start - start index.
   */
  public static findStorage(
    scriptHash: string,
    searchPrefix: string,
    start = 0
  ): Query<[string, string, number], FindStorageResult> {
    return new Query({
      method: "findstorage",
      params: [scriptHash, HexString.fromHex(searchPrefix).toBase64(), start],
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
  public static getNextBlockValidators(): Query<[], Validator[]> {
    return new Query({
      method: "getnextblockvalidators",
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
   * Invoke the verification portion of a contract.
   * @param scriptHash - hash of contract to test
   * @param args - arguments to pass
   * @param signers - Signers to be included in transaction
   */
  public static invokeContractVerify(
    scriptHash: string,
    args: unknown[] = [],
    signers: (Signer | SignerJson)[] = []
  ): Query<[string, unknown[], SignerJson[]], InvokeResult> {
    return new Query({
      method: "invokecontractverify",
      params: [
        scriptHash,
        args.map((a) => (a instanceof ContractParam ? a.toJson() : a)),
        signers.map((s) => (s instanceof Signer ? s.toJson() : s)),
      ],
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
        params.map((p) => (p instanceof ContractParam ? p.toJson() : p)),
        signers.map((s) => (s instanceof Signer ? s.toJson() : s)),
      ],
    });
  }

  /**
   * This Query runs the specific script through the VM.
   * @param script - base64-encoded string.
   * @param signers - scripthashes of witnesses that should sign the transaction containing this script.
   */
  public static invokeScript(
    script: string | HexString,
    signers: (Signer | SignerJson)[] = []
  ): Query<[string, SignerJson[]], InvokeResult> {
    return new Query({
      method: "invokescript",
      params: [
        script instanceof HexString ? script.toBase64() : script,
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
   * @param transaction - transaction as a Transaction object or base64 hexstring.
   */
  public static sendRawTransaction(
    transaction: Transaction | string | HexString
  ): Query<[string], SendResult> {
    const base64Tx = transformInputTransaction(transaction);
    return new Query({
      method: "sendrawtransaction",
      params: [base64Tx],
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

  /**
   * This Query returns the available unclaimed bonus GAS for a NEO address
   * @param addr - a NEO address
   */
  public static getUnclaimedGas(
    addr: string
  ): Query<[string], GetUnclaimedGasResult> {
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

  public equals(other: Partial<QueryLike<JsonRpcParams>>): boolean {
    if (this.id !== other.id && this.method !== other.method) {
      return false;
    }
    if (Array.isArray(this.params) && Array.isArray(other.params)) {
      const otherParams = other.params;
      return (
        this.params.length === otherParams.length &&
        this.params.every((val, ind) => otherParams[ind] === val)
      );
    }

    if (
      isJsonRpcParamRecord(this.params) &&
      isJsonRpcParamRecord(other.params)
    ) {
      return isEqual(this.params, other.params);
    }

    return false;
  }
}

export default Query;
