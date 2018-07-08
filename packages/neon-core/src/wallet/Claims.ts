import util from "util";
import ClaimItem, { ClaimItemLike } from "./components/ClaimItem";

export interface ClaimsLike {
  address: string;
  net: string;
  claims: ClaimItemLike[];
}
/**
 * @class Claims
 * @classdesc
 * Claims object used for claiming GAS.
 * @param {Claims} config - Claims-like object
 * @param {string} config.net - Network
 * @param {string}  config.address - The address for this Claims
 * @param {ClaimItem[]} config.claims - The list of claims to be made.
 */
export class Claims {
  public address: string;
  public net: string;
  public claims: ClaimItem[];

  constructor(config: Partial<ClaimsLike> = {}) {
    /** The address for this Claims */
    this.address = config.address || "";
    /** Network which this Claims is using */
    this.net = config.net || "NoNet";
    /** The list of claimable transactions */
    this.claims = config.claims ? config.claims.map(c => new ClaimItem(c)) : [];
  }

  get [Symbol.toStringTag]() {
    return "Claims";
  }

  public [util.inspect.custom]() {
    const claimsDump = this.claims.map(c => {
      return `${c.txid} <${c.index}>: ${c.claim.toString()}`;
    });
    return `[Claims(${this.net}): ${this.address}]\n${JSON.stringify(
      claimsDump,
      null,
      2
    )}`;
  }

  public export() {
    return {
      address: this.address,
      net: this.net,
      claims: this.claims.map(c => c.export())
    };
  }

  /**
   * Returns a Claims object that contains part of the total claims starting at start, ending at end.
   */
  public slice(start: number, end?: number): Claims {
    return new Claims({
      address: this.address,
      net: this.net,
      claims: this.claims.slice(start, end)
    });
  }
}

export default Claims;
