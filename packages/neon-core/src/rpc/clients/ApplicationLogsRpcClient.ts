import Query, { ApplicationLogJson } from "../Query";
import { RpcDispatcher, RpcDispatcherMixin } from "./RpcDispatcher";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ApplicationLogsRpcMixin<TBase extends RpcDispatcherMixin>(
  base: TBase,
) {
  return class extends base {
    public async getApplicationLog(
      blockOrTxHash: string,
    ): Promise<ApplicationLogJson> {
      return await this.execute(Query.getApplicationLog(blockOrTxHash));
    }
  };
}

export class ApplicationLogsRpcClient extends ApplicationLogsRpcMixin(
  RpcDispatcher,
) {
  public get [Symbol.toStringTag](): string {
    return `ApplicationLogsRpcClient(${this.url})`;
  }
}
