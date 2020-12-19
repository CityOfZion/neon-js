import {
  Query,
  GetNep17BalancesResult,
  GetNep17TransfersResult,
} from "../Query";
import { RpcDispatcher, RpcDispatcherMixin } from "./RpcDispatcher";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function Nep17TrackerRpcMixin<TBase extends RpcDispatcherMixin>(
  base: TBase
) {
  return class Nep17TrackerRpcInterface extends base {
    public async getNep17Transfers(
      accountIdentifier: string,
      startTime?: string,
      endTime?: string
    ): Promise<GetNep17TransfersResult> {
      return this.execute(
        Query.getNep17Transfers(accountIdentifier, startTime, endTime)
      );
    }
    public async getNep17Balances(
      accountIdentifier: string
    ): Promise<GetNep17BalancesResult> {
      return this.execute(Query.getNep17Balances(accountIdentifier));
    }
  };
}

export class Nep17TrackerRpcClient extends Nep17TrackerRpcMixin(RpcDispatcher) {
  public get [Symbol.toStringTag](): string {
    return `Nep17TrackerRpcClient(${this.url})`;
  }
}
