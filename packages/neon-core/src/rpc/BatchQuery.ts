import { Query, JsonRpcParams } from "./Query";

/**
 * Helper class that maintains the types in a list of Queries.
 * This allows the RpcDispatcher to return correctly typed responses.
 */
export class BatchQuery<
  TParams extends JsonRpcParams[],
  TResponses extends unknown[]
> {
  public queries: Query<JsonRpcParams, unknown>[];

  private constructor(q: Query<JsonRpcParams, TResponses>) {
    this.queries = [q];
  }

  public add<TParam extends JsonRpcParams, TResponse>(
    q: Query<TParam, TResponse>
  ): BatchQuery<[...TParams, TParam], [...TResponses, TResponse]> {
    this.queries.push(q);
    return this;
  }

  public static of<TParams extends JsonRpcParams, TResponse>(
    q: Query<TParams, TResponse>
  ): BatchQuery<[TParams], [TResponse]> {
    return new BatchQuery(q);
  }
}
