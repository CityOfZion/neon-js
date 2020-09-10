import Query, { GetApplicationLogsResult } from "../Query";
import { RpcDispatcher, RpcDispatcherMixin } from "./RpcDispatcher";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function ApplicationLogsRpcMixin<TBase extends RpcDispatcherMixin>(
  base: TBase
) {
  return class extends base {
    public async getApplicationLog(
      blockHash: string
    ): Promise<GetApplicationLogsResult> {
      return await this.execute(Query.getApplicationLogs(blockHash));
    }
  };
}

export class ApplicationLogsRpcClient extends ApplicationLogsRpcMixin(
  RpcDispatcher
) {
  public get [Symbol.toStringTag](): string {
    return `ApplicationLogsRpcClient(${this.url})`;
  }
}
