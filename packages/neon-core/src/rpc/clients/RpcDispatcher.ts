import { Query, RPCResponse, RPCErrorResponse } from "../Query";
import logger from "../../logging";
import Axios, { AxiosRequestConfig } from "axios";
import { timeout } from "../../settings";

const log = logger("rpc");

export interface RpcConfig {
  // Timeout in ms
  timeout?: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type GConstructor<T = {}> = new (...args: any[]) => T;
export type RpcDispatcherMixin = GConstructor<RpcDispatcher>;

export async function sendQuery<TResponse>(
  url: string,
  query: Query<unknown[], TResponse>,
  config: RpcConfig = {}
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
 * Basic JSON-RPC 2.0 Dispatcher. Contains the basic infrastructure to send out JSON-RPC 2.0 methods.
 * Client interfaces should accept this RpcDispatcher as a constructor parameter.
 *
 * @example
 *
 * ```ts
 * const dispatcher = new RpcDispatcher("http://www.example.com");
 * const result = await dispatcher.execute(new Query({"method": "listplugins"}));
 * ```
 */
export class RpcDispatcher {
  public url: string;

  public constructor(url: string) {
    this.url = url;
  }

  /**
   * Takes an Query object and executes it. Throws if error is encountered.
   */
  public async execute<TResponse>(
    query: Query<unknown[], TResponse>,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const rpcResponse = await sendQuery(this.url, query, config ?? {});
    if (rpcResponse.error) {
      throw new RpcError(rpcResponse.error);
    }
    return rpcResponse.result;
  }
}

export class RpcError extends Error {
  public code: number;

  constructor(errResponse: RPCErrorResponse) {
    super(errResponse.message);
    this.code = errResponse.code;
  }
}
