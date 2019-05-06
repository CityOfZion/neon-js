import BN from "bignumber.js";
import { reverseHex } from "./misc";

const DECIMALS = 100000000;

// 0x7fffffffffffffff = 9223372036854775807 (maximum hex fixed8)
const MAX_FIXED8_HEX = new BN(2).pow(63).minus(1);
export const MAX_FIXED8 = MAX_FIXED8_HEX.div(DECIMALS);

// 0x8000000000000000 = -9223372036854775808 (minimum hex fixed8)
const MIN_FIXED8_HEX = new BN(2).pow(63).negated();
export const MIN_FIXED8 = MIN_FIXED8_HEX.div(DECIMALS);

// Total hex fixed8 number. This inludes positve and negative numbers.
// 0xffffffffffffffff = 18446744073709551615
const TOTAL_FIXED8_HEX = new BN(2).pow(64);
/**
 * A fixed point notation used widely in the NEO system for representing decimals.
 * It is basically a hexideciaml integer that is divided by the 10^8.
 * Supports up to 8 decimals and is 8 bytes long.
 * @extends BN
 */
export class Fixed8 extends BN {
  public static fromHex(hex: string): Fixed8 {
    if (hex.length > 16) {
      throw new Error(
        `expected hex string to have length less or equal than 16: got ${
          hex.length
        } for hex = ${hex}`
      );
    }

    let n = new BN(hex, 16);
    if (n.isGreaterThan(MAX_FIXED8_HEX)) {
      // convert n to two complement
      n = n.minus(TOTAL_FIXED8_HEX);
    }

    return new Fixed8(n, 10).div(DECIMALS);
  }

  public static fromReverseHex(hex: string): Fixed8 {
    return this.fromHex(reverseHex(hex));
  }

  public constructor(input?: number | string | BN, base = 10) {
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
    let hexstring = "";
    const num = this.times(DECIMALS).round(0);

    hexstring = num.isLessThan(0)
      ? TOTAL_FIXED8_HEX.plus(num).toString(16) // convert num to two complement
      : num.toString(16);

    if (hexstring.length > 16) {
      throw new Error(
        `expected hex string to have length less or equal than 16: got ${
          hexstring.length
        } for hex = ${hexstring} `
      );
    }
    return "0".repeat(16 - hexstring.length) + hexstring;
  }

  public toReverseHex(): string {
    return reverseHex(this.toHex());
  }

  /**
   * Returns a Fixed8 whose value is rounded upwards to the next whole number.
   */
  public ceil(): Fixed8 {
    return new Fixed8(super.decimalPlaces(0, BN.ROUND_CEIL));
  }

  /**
   * Returns a Fixed8 whose value is rounded downwards to the previous whole number.
   */
  public floor(): Fixed8 {
    return new Fixed8(super.decimalPlaces(0, BN.ROUND_FLOOR));
  }

  /**
   * Returns true if the value is equivalent.
   */
  public equals(other: string | number | Fixed8 | BN): boolean {
    return super.eq(other);
  }

  /**
   * Returns a Fixed8 rounded to the nearest dp decimal places according to rounding mode rm.
   * If dp is null, round to whole number.
   * If rm is null, round according to default rounding mode.
   * @param dp
   * @param rm
   * @return {Fixed8}
   */
  public round(dp: number = 0, rm?: BN.RoundingMode): Fixed8 {
    return new Fixed8(super.decimalPlaces(dp, rm));
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
