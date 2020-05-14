import util from "util";
import ClaimItem, { ClaimItemLike } from "./components/ClaimItem";

const inspect = util.inspect.custom;
export interface ClaimsLike {
  address: string;
  net: string;
  claims: ClaimItemLike[];
}
/**
 * Claims object used for claiming GAS.
 */
export class Claims {
  /** The address for this Claims */
  public address: string;
  /** Network which this Claims is using */
  public net: string;
  /** The list of claimable transactions */
  public claims: ClaimItem[];

  public constructor(config: Partial<ClaimsLike> = {}) {
    this.address = config.address || "";
    this.net = config.net || "NoNet";
    this.claims = config.claims
      ? config.claims.map((c) => new ClaimItem(c))
      : [];
  }

  public get [Symbol.toStringTag](): string {
    return "Claims";
  }

  public [inspect](): string {
    const claimsDump = this.claims.map((c) => {
      return `${c.txid} <${c.index}>: ${c.claim.toString()}`;
    });
    return `[Claims(${this.net}): ${this.address}]\n${JSON.stringify(
      claimsDump,
      null,
      2
    )}`;
  }

  public export(): ClaimsLike {
    return {
      address: this.address,
      net: this.net,
      claims: this.claims.map((c) => c.export()),
    };
  }

  /**
   * Returns new Claims object that contains part of the total claims starting at start, ending at end.
   */
  public slice(start: number, end?: number): Claims {
    return new Claims({
      address: this.address,
      net: this.net,
      claims: this.claims.slice(start, end),
    });
  }
}

export default Claims;
