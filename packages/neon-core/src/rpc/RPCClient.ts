import { NeoServerRpcMixin } from "./clients/NeoServerRpcClient";
import {
  RpcDispatcher,
  ApplicationLogsRpcMixin,
  TokenTrackerRpcMixin,
} from "./clients";
import { Query } from "./Query";

const PING_TIMEOUT = 2000;
class FullRpcClient extends TokenTrackerRpcMixin(
  ApplicationLogsRpcMixin(NeoServerRpcMixin(RpcDispatcher)),
) {
  public get [Symbol.toStringTag](): string {
    return `FullRpcClient(${this.url})`;
  }
}
/**
 * RPC Client model to query a NEO node. Contains built-in methods to query using RPC calls.
 */
export class RPCClient extends FullRpcClient {
  public net: string;
  public history: Query<unknown[], unknown>[];
  public lastSeenHeight: number;
  private _latencies: number[];

  /**
   * @param net - A url pointing to a NEO RPC node.
   * @param version - version of NEO node. Used to check if RPC methods have been implemented. it will default to DEFAULT_RPC found in CONST
   */
  public constructor(net: string) {
    super(net);
    this.net = net;

    this.history = [];
    this.lastSeenHeight = 0;
    this._latencies = [];
  }

  public get [Symbol.toStringTag](): string {
    return `RPC Client(${this.net})`;
  }

  public get latency(): number {
    if (this._latencies.length === 0) {
      return 99999;
    }
    return Math.floor(
      this._latencies.reduce((p, c) => p + c, 0) / this._latencies.length,
    );
  }

  public set latency(lat: number) {
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
    try {
      const response = await this.getBlockCount();
      this.lastSeenHeight = response;
      const newPing = Date.now() - timeStart;
      this.latency = newPing;
      return newPing;
    } catch {
      this.latency = PING_TIMEOUT;
      return PING_TIMEOUT;
    }
  }
}

export default RPCClient;
