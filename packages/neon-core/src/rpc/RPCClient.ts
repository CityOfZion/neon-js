import { AxiosRequestConfig } from "axios";
import { DEFAULT_RPC, NEO_NETWORK, RPC_VERSION } from "../consts";
import logger from "../logging";
import { timeout } from "../settings";
import { BaseTransaction } from "../tx/transaction/BaseTransaction";
import { isAddress } from "../wallet";
import Query from "./Query";

const log = logger("rpc");

const versionRegex = /NEO:(\d+\.\d+\.\d+)/;

export interface Validator {
  publickey: string;
  votes: string;
  active: boolean;
}

/**
 * RPC Client model to query a NEO node. Contains built-in methods to query using RPC calls.
 */
export class RPCClient {
  public net: string;
  public history: Query[];
  public lastSeenHeight: number;
  public version: string;
  // tslint:disable-next-line:variable-name
  private _latencies: number[];

  /**
   * @param net 'MainNet' or 'TestNet' will query the default RPC address found in consts. You may provide a custom URL.
   * @param version Version of NEO node. Used to check if RPC methods have been implemented. it will default to DEFAULT_RPC found in CONST
   */
  constructor(net: string, version = RPC_VERSION) {
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

  get [Symbol.toStringTag]() {
    return "RPC Client";
  }

  get latency() {
    if (this._latencies.length === 0) {
      return 99999;
    }
    return Math.floor(
      this._latencies.reduce((p, c) => p + c, 0) / this._latencies.length
    );
  }

  set latency(lat) {
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
      this.lastSeenHeight = response.result;
      const newPing = Date.now() - timeStart;
      this.latency = newPing;
      return newPing;
    } catch (err) {
      this.latency = timeout.ping;
      return timeout.ping;
    }
  }

  /**
   * Takes an Query object and executes it. Adds the Query object to history.
   */
  public execute(query: Query, config?: AxiosRequestConfig): Promise<any> {
    this.history.push(query);
    log.info(`RPC: ${this.net} executing Query[${query.req.method}]`);
    return query.execute(this.net, config);
  }

  /**
   * Creates a query with the given req and immediately executes it.
   */
  public query(req: object, config?: AxiosRequestConfig): Promise<any> {
    const query = new Query(req);
    return this.execute(query, config);
  }

  /**
   * Gets the state of an account given an address.
   */
  public async getAccountState(addr: string): Promise<any> {
    if (!isAddress(addr)) {
      throw new Error(`Invalid address given: ${addr}`);
    }
    const response = await this.execute(Query.getAccountState(addr));
    return response.result;
  }

  /**
   * Gets the state of an asset given an id.
   */
  public async getAssetState(assetId: string): Promise<any> {
    const response = await this.execute(Query.getAssetState(assetId));
    return response.result;
  }

  /**
   * Gets the block at a given height or hash.
   */
  public async getBlock(
    indexOrHash: string | number,
    verbose = 1
  ): Promise<object | string> {
    const response = await this.execute(Query.getBlock(indexOrHash, verbose));
    return response.result;
  }

  /**
   * Gets the block hash at a given height.
   */
  public async getBlockHash(index: number): Promise<string> {
    const response = await this.execute(Query.getBlockHash(index));
    return response.result;
  }

  /**
   * Get the latest block hash.
   */
  public async getBestBlockHash(): Promise<string> {
    const response = await this.execute(Query.getBestBlockHash());
    return response.result;
  }

  /**
   * Get the current block height.
   */
  public async getBlockCount(): Promise<number> {
    const response = await this.execute(Query.getBlockCount());
    return response.result;
  }

  /**
   * Get the system fees of a block.
   * @param {number} index
   * @return {Promise<string>} - System fees as a string.
   */
  public async getBlockSysFee(index: number): Promise<string> {
    const response = await this.execute(Query.getBlockSysFee(index));
    return response.result;
  }

  /**
   * Gets the number of peers this node is connected to.
   * @return {Promise<number>}
   */
  public async getConnectionCount(): Promise<number> {
    const response = await this.execute(Query.getConnectionCount());
    return response.result;
  }

  /**
   * Gets the state of the contract at the given scriptHash.
   */
  public async getContractState(scriptHash: string): Promise<object> {
    const response = await this.execute(Query.getContractState(scriptHash));
    return response.result;
  }

  /**
   * Gets a list of all peers that this node has discovered.
   */
  public async getPeers(): Promise<object> {
    const response = await this.execute(Query.getPeers());
    return response.result;
  }

  /**
   * Gets a list of all transaction hashes waiting to be processed.
   */
  public async getRawMemPool(): Promise<string[]> {
    const response = await this.execute(Query.getRawMemPool());
    return response.result;
  }

  /**
   * Gets a transaction based on its hash.
   */
  public async getRawTransaction(
    txid: string,
    verbose: number = 1
  ): Promise<any> {
    const response = await this.execute(Query.getRawTransaction(txid, verbose));
    return response.result;
  }

  /**
   * Gets the corresponding value of a key in the storage of a contract address.
   */
  public async getStorage(scriptHash: string, key: string): Promise<string> {
    const response = await this.execute(Query.getStorage(scriptHash, key));
    return response.result;
  }

  /**
   * Gets the transaction output given a transaction id and index
   */
  public async getTxOut(txid: string, index: number): Promise<any> {
    const response = await this.execute(Query.getTxOut(txid, index));
    return response.result;
  }

  /**
   * Gets the list of validators available for voting.
   */
  public async getValidators(): Promise<Validator[]> {
    const response = await this.execute(Query.getValidators());
    return response.result;
  }
  /**
   * Gets the version of the NEO node. This method will never be blocked by version. This method will also update the current Client's version to the one received.
   */
  public async getVersion(): Promise<string> {
    try {
      const response = await this.execute(Query.getVersion());
      if (response && response.result && response.result.useragent) {
        const newVersion = response.result.useragent.match(versionRegex)[1];
        this.version = newVersion;
      } else {
        this.version = RPC_VERSION;
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
   * Calls a smart contract with the given parameters. This method is a local invoke, results are not reflected on the blockchain.
   */
  public async invoke(scriptHash: string, ...params: any[]): Promise<any> {
    const response = await this.execute(Query.invoke(scriptHash, ...params));
    return response.result;
  }

  /**
   * Submits a contract method call with parameters for the node to run. This method is a local invoke, results are not reflected on the blockchain.
   */
  public async invokeFunction(
    scriptHash: string,
    operation: string,
    ...params: any[]
  ): Promise<any> {
    const response = await this.execute(
      Query.invokeFunction(scriptHash, operation, ...params)
    );
    return response.result;
  }

  /**
   * Submits a script for the node to run. This method is a local invoke, results are not reflected on the blockchain.
   */
  public async invokeScript(script: string): Promise<object> {
    const response = await this.execute(Query.invokeScript(script));
    return response.result;
  }

  /**
   * Sends a serialized transaction to the network.
   */
  public async sendRawTransaction(
    transaction: BaseTransaction | string
  ): Promise<boolean> {
    const response = await this.execute(Query.sendRawTransaction(transaction));
    return response.result;
  }

  /**
   * Submits a serialized block to the network.
   */
  public async submitBlock(block: string): Promise<any> {
    const response = await this.execute(Query.submitBlock(block));
    return response.result;
  }

  /**
   * Checks if the provided address is a valid NEO address.
   */
  public async validateAddress(addr: string): Promise<boolean> {
    const response = await this.execute(Query.validateAddress(addr));
    return response.result.isvalid;
  }
}

export default RPCClient;
