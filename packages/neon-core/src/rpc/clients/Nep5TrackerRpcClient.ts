import { Query, GetNep5BalancesResult, GetNep5TransfersResult } from "../Query";
import { RpcDispatcher, RpcDispatcherMixin } from "./RpcDispatcher";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function Nep5TrackerRpcMixin<TBase extends RpcDispatcherMixin>(
  base: TBase
) {
  return class Nep5TrackerRpcInterface extends base {
    public async getNep5Transfers(
      accountIdentifier: string,
      startTime?: string,
      endTime?: string
    ): Promise<GetNep5TransfersResult> {
      return this.execute(
        Query.getNep5Transfers(accountIdentifier, startTime, endTime)
      );
    }
    public async getNep5Balances(
      accountIdentifier: string
    ): Promise<GetNep5BalancesResult> {
      return this.execute(Query.getNep5Balances(accountIdentifier));
    }
  };
}

export class Nep5TrackerRpcClient extends Nep5TrackerRpcMixin(RpcDispatcher) {
  public get [Symbol.toStringTag](): string {
    return `Nep5TrackerRpcClient(${this.url})`;
  }
}
