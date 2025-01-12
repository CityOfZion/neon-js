import {
  Query,
  GetNep17BalancesResult,
  GetNep17TransfersResult,
  GetNep11TransfersResult,
  GetNep11BalancesResult,
} from "../Query";
import { RpcDispatcher, RpcDispatcherMixin } from "./RpcDispatcher";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function TokenTrackerRpcMixin<TBase extends RpcDispatcherMixin>(
  base: TBase,
) {
  return class TokenTrackerRpcInterface extends base {
    public async getNep17Transfers(
      accountIdentifier: string,
      startTime?: string,
      endTime?: string,
    ): Promise<GetNep17TransfersResult> {
      return this.execute(
        Query.getNep17Transfers(accountIdentifier, startTime, endTime),
      );
    }
    public async getNep17Balances(
      accountIdentifier: string,
    ): Promise<GetNep17BalancesResult> {
      return this.execute(Query.getNep17Balances(accountIdentifier));
    }

    public async getNep11Transfers(
      accountIdentifier: string,
      startTime?: string,
      endTime?: string,
    ): Promise<GetNep11TransfersResult> {
      return this.execute(
        Query.getNep11Transfers(accountIdentifier, startTime, endTime),
      );
    }

    public async getNep11Balances(
      accountIdentifier: string,
    ): Promise<GetNep11BalancesResult> {
      return this.execute(Query.getNep11Balances(accountIdentifier));
    }
  };
}

export class TokenTrackerRpcClient extends TokenTrackerRpcMixin(RpcDispatcher) {
  public get [Symbol.toStringTag](): string {
    return `TokenTrackerRpcClient(${this.url})`;
  }
}
