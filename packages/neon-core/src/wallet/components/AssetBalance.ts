import { compareNeonObjectArray, NeonObject } from "../../helper";
import Fixed8 from "../../u/Fixed8";
import Coin, { CoinLike } from "./Coin";

export interface AssetBalanceLike {
  balance: Fixed8 | number | string;
  unspent: CoinLike[];
  spent: CoinLike[];
  unconfirmed: CoinLike[];
}

export class AssetBalance implements NeonObject {
  public unspent: Coin[];
  public spent: Coin[];
  public unconfirmed: Coin[];

  constructor(abLike: Partial<AssetBalanceLike> = {}) {
    this.unspent = abLike.unspent
      ? abLike.unspent.map(coin => new Coin(coin))
      : [];
    this.spent = abLike.spent ? abLike.spent.map(coin => new Coin(coin)) : [];
    this.unconfirmed = abLike.unconfirmed
      ? abLike.unconfirmed.map(coin => new Coin(coin))
      : [];
  }

  public get balance(): Fixed8 {
    return this.unspent.reduce((p, c) => p.add(c.value), new Fixed8(0));
  }

  public export(): AssetBalanceLike {
    return {
      balance: this.balance.toNumber(),
      unspent: this.unspent.map(c => c.export()),
      spent: this.spent.map(c => c.export()),
      unconfirmed: this.unconfirmed.map(c => c.export())
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
