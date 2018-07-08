import BN from "bignumber.js";
import { reverseHex } from "./misc";

export class Fixed8 extends BN {
  public static fromHex(hex: string): Fixed8 {
    return new Fixed8(hex, 16).div(100000000);
  }

  public static fromReverseHex(hex: string): Fixed8 {
    return this.fromHex(reverseHex(hex));
  }

  constructor(input?: number | string | BN, base = 10) {
    if (!input) {
      input = "0";
    }
    if (typeof input === "number") {
      input = input.toFixed(8);
    }
    super(input, base);
    Object.setPrototypeOf(this, Fixed8.prototype);
  }

  public toHex(): string {
    const hexstring = this.times(100000000)
      .round(0)
      .toString(16);
    return "0".repeat(16 - hexstring.length) + hexstring;
  }

  public toReverseHex(): string {
    return reverseHex(this.toHex());
  }

  /**
   * Returns a Fixed8 whose value is rounded upwards to the next whole number.
   */
  public ceil(): Fixed8 {
    return new Fixed8(super.ceil());
  }

  /**
   * Returns a Fixed8 whose value is rounded downwards to the previous whole number.
   */
  public floor(): Fixed8 {
    return new Fixed8(super.floor());
  }

  /**
   * Returns a Fixed8 rounded to the nearest dp decimal places according to rounding mode rm.
   * If dp is null, round to whole number.
   * If rm is null, round according to default rounding mode.
   * @param dp
   * @param rm
   * @return {Fixed8}
   */
  public round(dp?: number, rm?: number): Fixed8 {
    return new Fixed8(super.round(dp, rm));
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 divided by `n`
   * @alias div
   */
  public dividedBy(n: string | number | BN, base?: number): Fixed8 {
    return new Fixed8(super.dividedBy(n, base));
  }

  public div(n: string | number | BN, base?: number): Fixed8 {
    return this.dividedBy(n, base);
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 multipled by `n`
   * @alias mul
   */
  public times(n: string | number | BN, base?: number): Fixed8 {
    return new Fixed8(super.times(n, base));
  }

  public mul(n: string | number | BN, base?: number): Fixed8 {
    return this.times(n, base);
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 plus `n`
   * @alias add
   */
  public plus(n: string | number | BN, base?: number): Fixed8 {
    return new Fixed8(super.plus(n, base));
  }

  public add(n: string | number | BN, base?: number): Fixed8 {
    return this.plus(n, base);
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 minus `n`
   * @alias sub
   */
  public minus(n: string | number | BN, base?: number): Fixed8 {
    return new Fixed8(super.minus(n, base));
  }

  public sub(n: string | number | BN, base?: number): Fixed8 {
    return this.minus(n, base);
  }
}

export default Fixed8;
