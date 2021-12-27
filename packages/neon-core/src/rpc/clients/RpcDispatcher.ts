import { Query, RPCResponse, RPCErrorResponse, JsonRpcParams } from "../Query";
import logger from "../../logging";
import { fetch } from "cross-fetch";
import { AbortController } from "abort-controller";
import { BatchQuery } from "../BatchQuery";

const log = logger("rpc");

export interface RpcConfig {
  // Timeout in ms
  timeout?: number;
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export type GConstructor<T = {}> = new (...args: any[]) => T;
export type RpcDispatcherMixin = GConstructor<RpcDispatcher>;

/**
 * Low level method to directly send a json-rpc request.
 * @param url - address to send request to
 * @param query - json-rpc request body
 * @param config - rpc configuration
 * @returns a json-rpc response
 */
export async function sendQuery<TResponse>(
  url: string,
  query: Query<JsonRpcParams, TResponse>,
  config: RpcConfig = {}
): Promise<RPCResponse<TResponse>> {
  log.info(`RPC: ${url} executing Query[${query.method}]`);
  const fetchConfig = _createFetchReq(query.export(), config);
  const response = await fetch(url, fetchConfig);

  if (response.ok) {
    return response.json();
  }
  throw new Error(
    `Encountered HTTP code ${response.status} while executing Query[${query.method}]`
  );
}

/**
 * Low level method to directly send a list of json-rpc requests.
 * Note that the responses will not be typed.
 * @param url - address to send request to
 * @param batch - array
 * @param config - rpc configuration
 * @returns a list of untyped json-rpc responses
 */
export async function sendQueryList(
  url: string,
  batch: Query<JsonRpcParams, unknown>[],
  config: RpcConfig = {}
): Promise<RPCResponse<unknown>[]> {
  const fetchConfig = _createFetchReq(
    batch.map((q) => q.export()),
    config
  );

  const response = await fetch(url, fetchConfig);

  if (response.ok) {
    return response.json();
  }
  throw new Error(
    `Encountered HTTP code ${response.status} while executing Query[${batch
      .map((q) => q.method)
      .join(",")}]`
  );
}

function _createFetchReq(body: object, config: RpcConfig): RequestInit {
  const fetchConfig: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  if (config.timeout) {
    const timeoutController = new AbortController();
    setTimeout(() => timeoutController.abort(), config.timeout);
    fetchConfig.signal = timeoutController.signal;
  }

  return fetchConfig;
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
    query: Query<JsonRpcParams, TResponse>,
    config?: RpcConfig
  ): Promise<TResponse> {
    const rpcResponse = await sendQuery(this.url, query, config ?? {});
    if (rpcResponse.error) {
      throw new RpcError(rpcResponse.error);
    }
    return rpcResponse.result;
  }

  /**
   * Takes an array of Queries and executes them.
   * Throws if any of the queries encounters an error.
   * @param batchQuery - Array of queries or a BatchQuery
   * @param config - Configuration to apply to the RPC call
   * @returns list of unwrapped json-rpc results
   *
   * @example
   *
   * ```ts
   * const dispatcher = new RpcDispatcher("http://www.example.com");
   * const response = dispatcher.executeAll(
   *    BatchQuery.of(new Query({method: "getversion"}))
   *      .add(new Query({method: "getblockcount"}))
   * );
   * // Correctly typed response when using BatchQuery
   * console.log(response[0].protocol.network);
   *
   * // You will have to manually type the response when using a plain array
   * const response = dispatcher.executeAll<GetVersionResult, number>([
   *    new Query({method: "getversion"}),
   *    new Query({method: "getblockcount"})
   * ]);
   *
   * console.log(response[0].protocol.network);
   * ```
   */
  public async executeAll<TResponses extends unknown[]>(
    batchQuery: BatchQuery<JsonRpcParams[], TResponses>,
    config?: RpcConfig
  ): Promise<TResponses>;
  public async executeAll<TResponses extends unknown[]>(
    batchQuery: Query<JsonRpcParams, unknown>[],
    config?: RpcConfig
  ): Promise<TResponses>;
  public async executeAll<TResponses extends unknown[]>(
    batchQuery:
      | BatchQuery<JsonRpcParams[], TResponses>
      | Query<JsonRpcParams, unknown>[],
    config?: RpcConfig
  ): Promise<TResponses> {
    const responses = await sendQueryList(
      this.url,
      Array.isArray(batchQuery) ? batchQuery : batchQuery.queries,
      config ?? {}
    );
    if (responses.some((r) => r.error)) {
      const allErrs: Record<string, RPCErrorResponse> = {};

      responses.forEach((r, idx) => {
        if (r.error) {
          allErrs[`query[${idx}]`] = r.error;
        }
      });
      throw new RpcError({ code: -1, message: JSON.stringify(allErrs) });
    }
    return responses.map((r) => r.result) as TResponses;
  }
}

export class RpcError extends Error {
  public code: number;

  constructor(errResponse: RPCErrorResponse) {
    super(errResponse.message);
    this.code = errResponse.code;
  }
}
