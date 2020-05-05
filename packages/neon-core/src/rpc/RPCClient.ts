import Axios, { AxiosRequestConfig } from "axios";
import { DEFAULT_RPC, NEO_NETWORK, RPC_VERSION } from "../consts";
import logger from "../logging";
import { timeout } from "../settings";
import { Transaction } from "../tx";
import {
  Query,
  CliPlugin,
  GetPeersResult,
  GetRawMemPoolResult,
  GetRawTransactionResult,
  InvokeResult,
  RPCResponse,
  BooleanLikeParam,
} from "./Query";
import { ContractManifest } from "../sc";
import { BlockJson, BlockHeaderJson, Validator } from "../types";

const log = logger("rpc");

export async function sendQuery<TResponse>(
  url: string,
  query: Query<unknown[], TResponse>,
  config: AxiosRequestConfig = {}
): Promise<RPCResponse<TResponse>> {
  log.info(`RPC: ${url} executing Query[${query.method}]`);
  const conf = Object.assign(
    {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: timeout.rpc,
    },
    config
  );

  const response = await Axios.post(url, query.export(), conf);
  return response.data as RPCResponse<TResponse>;
}
/**
 * RPC Client model to query a NEO node. Contains built-in methods to query using RPC calls.
 */
export class RPCClient {
  public net: string;
  public history: Query<unknown[], unknown>[];
  public lastSeenHeight: number;
  public version: string;
  private _latencies: number[];

  /**
   * @param net 'MainNet' or 'TestNet' will query the default RPC address found in consts. You may provide a custom URL.
   * @param version Version of NEO node. Used to check if RPC methods have been implemented. it will default to DEFAULT_RPC found in CONST
   */
  public constructor(net: string, version = RPC_VERSION) {
    if (net === NEO_NETWORK.MAIN) {
      this.net = DEFAULT_RPC.MAIN;
    } else if (net === NEO_NETWORK.TEST) {
      this.net = DEFAULT_RPC.TEST;
    } else {
      this.net = net;
    }

    this.history = [];
    this.lastSeenHeight = 0;
    this._latencies = [];

    this.version = version;
  }

  public get [Symbol.toStringTag](): string {
    return "RPC Client";
  }

  public get latency(): number {
    if (this._latencies.length === 0) {
      return 99999;
    }
    return Math.floor(
      this._latencies.reduce((p, c) => p + c, 0) / this._latencies.length
    );
  }

  public set latency(lat) {
    if (this._latencies.length > 4) {
      this._latencies.shift();
    }
    this._latencies.push(lat);
  }

  /**
   * Measures the latency using getBlockCount call. Returns the current latency. For average, call this.latency
   */
  public async ping(): Promise<number> {
    const timeStart = Date.now();
    const query = Query.getBlockCount();
    try {
      const response = await this.execute(query, { timeout: timeout.ping });
      this.lastSeenHeight = response;
      const newPing = Date.now() - timeStart;
      this.latency = newPing;
      return newPing;
    } catch (err) {
      this.latency = timeout.ping;
      return timeout.ping;
    }
  }

  /**
   * Takes an Query object and executes it. Throws if error is encountered.
   */
  public async execute<TResponse>(
    query: Query<unknown[], TResponse>,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const rpcResponse = await sendQuery(this.net, query, config ?? {});
    if (rpcResponse.error) {
      throw new Error(rpcResponse.error.message);
    }
    return rpcResponse.result;
  }

  /**
   * Creates a query with the given req and immediately executes it.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public query(req: object, config?: AxiosRequestConfig): Promise<any> {
    const query = new Query(req);
    return this.execute(query, config);
  }

  /**
   * Get the latest block hash.
   */
  public async getBestBlockHash(): Promise<string> {
    const response = await this.execute(Query.getBestBlockHash());
    return response;
  }

  /**
   * Gets the block at a given height or hash.
   * @param indexOrHash - height or hash of desired block;
   * @param verbose - 0 for serialized block in hex, 1 for json format, defaults to 0
   * @returns string or block object according to verbose
   */
  public async getBlock(
    indexOrHash: number | string,
    verbose?: 0 | false
  ): Promise<string>;
  public async getBlock(
    indexOrHash: number | string,
    verbose: 1 | true
  ): Promise<BlockJson>;
  public async getBlock(
    indexOrHash: number | string,
    verbose?: BooleanLikeParam
  ): Promise<string | BlockJson> {
    return verbose
      ? await this.execute(Query.getBlock(indexOrHash, 1))
      : await this.execute(Query.getBlock(indexOrHash, 0));
  }

  /**
   * Gets the block hash at a given height.
   */
  public async getBlockHash(index: number): Promise<string> {
    const response = await this.execute(Query.getBlockHash(index));
    return response;
  }

  /**
   * Get the current block height.
   */
  public async getBlockCount(): Promise<number> {
    const response = await this.execute(Query.getBlockCount());
    return response;
  }

  /**
   * Get the corresponding block header information according to the specified script hash.
   * @param indexOrHash - height or hash of desired block
   * @param verbose - 0 for serialized block in hex, 1 for json format, defaults to 0
   * @returns verbose = 0, blocker header hex string; verbose = 1, block header info in json
   */
  public async getBlockHeader(
    indexOrHash: number | string,
    verbose?: 0
  ): Promise<string>;
  public async getBlockHeader(
    indexOrHash: number | string,
    verbose: 1
  ): Promise<BlockHeaderJson>;
  public async getBlockHeader(
    indexOrHash: number | string,
    verbose?: 0 | 1
  ): Promise<string | BlockHeaderJson> {
    return verbose
      ? await this.execute(Query.getBlockHeader(indexOrHash, 1))
      : await this.execute(Query.getBlockHeader(indexOrHash, 0));
  }

  /**
   * Gets the number of peers this node is connected to.
   * @return {Promise<number>}
   */
  public async getConnectionCount(): Promise<number> {
    const response = await this.execute(Query.getConnectionCount());
    return response;
  }

  /**
   * Gets the state of the contract at the given scriptHash.
   */
  public async getContractState(scriptHash: string): Promise<ContractManifest> {
    const response = await this.execute(Query.getContractState(scriptHash));
    return new ContractManifest(response.manifest);
  }

  /**
   * Gets a list of all peers that this node has discovered.
   */
  public async getPeers(): Promise<GetPeersResult> {
    const response = await this.execute(Query.getPeers());
    return response;
  }

  /**
   * This Query returns the transaction hashes of the transactions confirmed or unconfirmed.
   * @param shouldGetUnverified Optional. Default is 0.
   * shouldGetUnverified = 0, get confirmed transaction hashes
   * shouldGetUnverified = 1, get current block height and confirmed and unconfirmed tx hash
   */
  public async getRawMemPool(
    shouldGetUnverified?: 0 | false
  ): Promise<string[]>;
  public async getRawMemPool(
    shouldGetUnverified: 1 | true
  ): Promise<GetRawMemPoolResult>;
  public async getRawMemPool(
    shouldGetUnverified: BooleanLikeParam = 0
  ): Promise<string[] | GetRawMemPoolResult> {
    return shouldGetUnverified
      ? await this.execute(Query.getRawMemPool(1))
      : await this.execute(Query.getRawMemPool(0));
  }

  /**
   * Gets a transaction based on its hash.
   * @param txid - transaction id
   * @param verbose - 0, will query transaction in hex string; 1 will query for transaction object. defaults to 0
   * @return transaction hex or object
   */
  public async getRawTransaction(
    txid: string,
    verbose?: 0 | false
  ): Promise<string>;
  public async getRawTransaction(
    txid: string,
    verbose: 1 | true
  ): Promise<GetRawTransactionResult>;
  public async getRawTransaction(
    txid: string,
    verbose?: BooleanLikeParam
  ): Promise<string | GetRawTransactionResult> {
    return verbose
      ? await this.execute(Query.getRawTransaction(txid, 1))
      : await this.execute(Query.getRawTransaction(txid, 0));
  }

  /**
   * Gets the corresponding value of a key in the storage of a contract address.
   */
  public async getStorage(scriptHash: string, key: string): Promise<string> {
    const response = await this.execute(Query.getStorage(scriptHash, key));
    return response;
  }

  /**
   * Gets the block index in which the transaction is found.
   * @param txid hash of the specific transaction.
   */
  public async getTransactionHeight(txid: string): Promise<number> {
    const response = await this.execute(Query.getTransactionHeight(txid));
    return response;
  }

  /**
   * Gets the list of validators available for voting.
   */
  public async getValidators(): Promise<Validator[]> {
    const response = await this.execute(Query.getValidators());
    return response;
  }
  /**
   * Gets the version of the NEO node. This method will never be blocked by version. This method will also update the current Client's version to the one received.
   */
  public async getVersion(): Promise<string> {
    try {
      const response = await this.execute(Query.getVersion());
      if (response?.user_agent) {
        const useragent = response.user_agent;
        const responseLength = useragent.length;
        const strippedResponse = useragent.substring(1, responseLength - 1);
        this.version = strippedResponse.split(":")[1];
      } else {
        throw new Error(
          `Empty or unexpected version pattern. Got ${JSON.stringify(response)}`
        );
      }
      return this.version;
    } catch (err) {
      if (err.message.includes("Method not found")) {
        this.version = RPC_VERSION;
        return this.version;
      } else {
        throw err;
      }
    }
  }

  /**
   * This Query returns a list of plugins loaded by the node.
   */
  public async listPlugins(): Promise<CliPlugin[]> {
    const response = await this.execute(Query.listPlugins());
    return response;
  }

  /**
   * Submits a contract method call with parameters for the node to run. This method is a local invoke, results are not reflected on the blockchain.
   */
  public async invokeFunction(
    scriptHash: string,
    operation: string,
    ...params: unknown[]
  ): Promise<InvokeResult> {
    if (params.length === 1 && Array.isArray(params)) {
      return await this.execute(
        Query.invokeFunction(scriptHash, operation, params[0])
      );
    }

    return await this.execute(
      Query.invokeFunction(scriptHash, operation, params)
    );
  }

  /**
   * Submits a script for the node to run. This method is a local invoke, results are not reflected on the blockchain.
   */
  public async invokeScript(script: string): Promise<InvokeResult> {
    const response = await this.execute(Query.invokeScript(script));
    return response;
  }

  /**
   * Sends a serialized transaction to the network.
   * @return transaction id
   */
  public async sendRawTransaction(
    transaction: Transaction | string
  ): Promise<string> {
    const response = await this.execute(Query.sendRawTransaction(transaction));
    return response.hash;
  }

  /**
   * Submits a serialized block to the network.
   * @return block hash if success
   */
  public async submitBlock(block: string): Promise<string> {
    const response = await this.execute(Query.submitBlock(block));
    return response.hash;
  }

  /**
   * Checks if the provided address is a valid NEO address.
   */
  public async validateAddress(addr: string): Promise<boolean> {
    const response = await this.execute(Query.validateAddress(addr));
    return response.isvalid;
  }
}

export default RPCClient;
