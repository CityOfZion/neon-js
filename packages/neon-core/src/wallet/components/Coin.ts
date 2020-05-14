import Fixed8 from "../../u/Fixed8";

export interface CoinLike {
  index: number;
  txid: string;
  value: Fixed8 | number | string;
}

/**
 * An alternative form of a TransactionOutput.
 */
export class Coin {
  public index: number;
  public txid: string;
  public value: Fixed8;

  public constructor(coinLike: Partial<CoinLike> = {}) {
    this.index = coinLike.index || 0;
    this.txid = coinLike.txid || "";
    this.value = new Fixed8(coinLike.value);
  }

  public export(): CoinLike {
    return {
      index: this.index,
      txid: this.txid,
      value: this.value.toNumber(),
    };
  }

  public equals(other: Partial<CoinLike>): boolean {
    return (
      this.index === other.index &&
      this.txid === other.txid &&
      this.value.equals(other.value || 0)
    );
  }
}

export default Coin;
