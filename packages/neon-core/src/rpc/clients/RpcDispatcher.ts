import { Query, RPCResponse, RPCErrorResponse } from "../Query";
import logger from "../../logging";
import { fetch } from "cross-fetch";
import { AbortController } from "abort-controller";

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
  const fetchConfig: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query.export()),
  };

  if (config.timeout) {
    const timeoutController = new AbortController();
    setTimeout(() => timeoutController.abort(), config.timeout);
    fetchConfig.signal = timeoutController.signal;
  }
  const response = await fetch(url, fetchConfig);

  if (response.ok) {
    return response.json();
  }
  throw new Error(
    `Encountered HTTP code ${response.status} while executing Query[${query.method}]`
  );
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
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      throw new Error(
        "Please provide an url that starts with http:// or https://"
      );
    }
    this.url = url;
  }

  /**
   * Takes an Query object and executes it. Throws if error is encountered.
   */
  public async execute<TResponse>(
    query: Query<unknown[], TResponse>,
    config?: RpcConfig
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
