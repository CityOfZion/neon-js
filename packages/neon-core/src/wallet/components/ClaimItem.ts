import Fixed8 from "../../u/Fixed8";

export interface ClaimItemLike {
  claim: Fixed8 | number | string;
  txid: string;
  index: number;
  value: number;
  start?: number;
  end?: number;
}

/**
 * Contains the information necessary to validate a GAS Claim.
 * It is a reference to a spent coin.
 */
export class ClaimItem {
  public claim: Fixed8;
  public txid: string;
  public index: number;
  public value: number;
  public start?: number;
  public end?: number;

  public constructor(claimItemLike: Partial<ClaimItemLike> = {}) {
    this.claim = new Fixed8(claimItemLike.claim);
    this.txid = claimItemLike.txid || "";
    this.index = claimItemLike.index || 0;
    this.value = claimItemLike.value || 0;
    this.start = claimItemLike.start;
    this.end = claimItemLike.end;
  }

  public export(): ClaimItemLike {
    return {
      claim: this.claim.toNumber(),
      txid: this.txid,
      index: this.index,
      value: this.value,
      start: this.start,
      end: this.end,
    };
  }

  public equals(other: Partial<ClaimItemLike>): boolean {
    return (
      this.claim.equals(other.claim || 0) &&
      this.txid === other.txid &&
      this.index === other.index &&
      this.value === other.value &&
      this.start === other.start &&
      this.end === other.end
    );
  }
}

export default ClaimItem;
