import { compareNeonObjectArray, NeonObject } from "../../helper";
import Fixed8 from "../../u/Fixed8";
import Coin, { CoinLike } from "./Coin";

export interface AssetBalanceLike {
  balance: Fixed8 | number | string;
  unspent: CoinLike[];
  spent: CoinLike[];
  unconfirmed: CoinLike[];
}

/**
 * Balance of an UTXO asset.
 * We keep track of 3 states: unspent, spent and unconfirmed.
 * Unspent coins are ready to be constructed into transactions.
 * Spent coins have been used once in confirmed transactions and cannot be used anymore. They are kept here for tracking purposes.
 * Unconfirmed coins have been used in transactions but are not confirmed yet. This is a holding state until we confirm that the transactions are mined into blocks.
 */
export class AssetBalance implements NeonObject {
  public unspent: Coin[];
  public spent: Coin[];
  public unconfirmed: Coin[];

  public constructor(abLike: Partial<AssetBalanceLike> = {}) {
    this.unspent = abLike.unspent
      ? abLike.unspent.map((coin) => new Coin(coin))
      : [];
    this.spent = abLike.spent ? abLike.spent.map((coin) => new Coin(coin)) : [];
    this.unconfirmed = abLike.unconfirmed
      ? abLike.unconfirmed.map((coin) => new Coin(coin))
      : [];
  }

  public get balance(): Fixed8 {
    return this.unspent.reduce((p, c) => p.add(c.value), new Fixed8(0));
  }

  public export(): AssetBalanceLike {
    return {
      balance: this.balance.toNumber(),
      unspent: this.unspent.map((c) => c.export()),
      spent: this.spent.map((c) => c.export()),
      unconfirmed: this.unconfirmed.map((c) => c.export()),
    };
  }

  public equals(other: Partial<AssetBalanceLike>): boolean {
    return (
      compareNeonObjectArray(this.unspent, other.unspent) &&
      compareNeonObjectArray(this.spent, other.spent) &&
      compareNeonObjectArray(this.unconfirmed, other.unconfirmed)
    );
  }
}

export default AssetBalance;
