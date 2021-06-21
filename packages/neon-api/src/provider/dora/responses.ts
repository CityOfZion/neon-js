import { NeoCliBalance, NeoCliClaimable } from "../neoCli/responses";
import { IAddressAbstract, Entry } from "../common";
export interface DoraGetBalanceResponse {
  balance: NeoCliBalance[];
  address: string;
}

export interface DoraGetUnclaimedResponse {
  available: number;
  unavailable: number;
  unclaimed: number;
}

export interface DoraGetClaimableResponse {
  address: string;
  claimable: NeoCliClaimable[];
  unclaimed: number;
}

export type TEntry = Omit<Entry, "amount"> & { amount: number };

export interface DoraAddressAbstracts
  extends Omit<IAddressAbstract, "entries"> {
  entries: TEntry[];
}
