import { DEFAULT_RPC, NEO_NETWORK, RPC_VERSION } from "../consts";
import { timeout } from "../settings";
import { NeoServerRpcMixin } from "./clients/NeoServerRpcClient";
import {
  RpcDispatcher,
  ApplicationLogsRpcMixin,
  Nep17TrackerRpcMixin,
} from "./clients";
import { Query } from "./Query";

function parseNetwork(net: string): string {
  if (net === NEO_NETWORK.MAIN) {
    return DEFAULT_RPC.MAIN;
  } else if (net === NEO_NETWORK.TEST) {
    return DEFAULT_RPC.TEST;
  } else {
    return net;
  }
}

class FullRpcClient extends Nep17TrackerRpcMixin(
  ApplicationLogsRpcMixin(NeoServerRpcMixin(RpcDispatcher))
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
  public version: string;
  private _latencies: number[];

  /**
   * @param net - 'MainNet' or 'TestNet' will query the default RPC address found in consts. You may provide a custom URL.
   * @param version - version of NEO node. Used to check if RPC methods have been implemented. it will default to DEFAULT_RPC found in CONST
   */
  public constructor(net: string, version = RPC_VERSION) {
    const url = parseNetwork(net);
    super(url);
    this.net = url;

    this.history = [];
    this.lastSeenHeight = 0;
    this._latencies = [];

    this.version = version;
  }

  public get [Symbol.toStringTag](): string {
    return `RPC Client(${this.net})`;
  }

  public get latency(): number {
    if (this._latencies.length === 0) {
      return 99999;
    }
    return Math.floor(
      this._latencies.reduce((p, c) => p + c, 0) / this._latencies.length
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
    } catch (err) {
      this.latency = timeout.ping;
      return timeout.ping;
    }
  }
}

export default RPCClient;
