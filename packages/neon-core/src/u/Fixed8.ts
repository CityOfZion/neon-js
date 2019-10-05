import BN from "bignumber.js";
import { reverseHex } from "./misc";

const DECIMALS = 100000000;

// This is the maximum hex integer 0x7fffffffffffffff (= 9223372036854775807)
// that can be converted to Fixed8 by dividing by the 10^8.
const MAX_FIXED8_HEX = new BN(2).pow(63).minus(1);

// This is the minimum hex integer 0x8000000000000000 (= -9223372036854775808)
// that can be converted to Fixed8 by dividing by the 10^8.
const MIN_FIXED8_HEX = new BN(2).pow(63).negated();

// Total number of Fixed8 available. This includes negative and positive
// Fixed8 numbers.
const TOTAL_FIXED8_HEX = new BN(2).pow(64);

/**
 * A fixed point notation used widely in the NEO system for representing decimals.
 * It is basically a hexideciaml integer that is divided by the 10^8.
 * Supports up to 8 decimals and is 8 bytes long.
 * @extends BN
 */
export class Fixed8 extends BN {
  // The maximum Fixed8 is obtained by dividing 0x7fffffffffffffff (= 9223372036854775807) with 10^8.
  public static readonly MAX_VALUE = new Fixed8(MAX_FIXED8_HEX.div(DECIMALS));

  // The minimum Fixed8 is obtained by dividing 0x8000000000000000 (= -9223372036854775808) with 10^8.
  public static readonly MIN_VALUE = new Fixed8(MIN_FIXED8_HEX.div(DECIMALS));

  public static fromHex(hex: string): Fixed8 {
    if (hex.length > 16) {
      throw new Error(
        `expected hex string to have length less or equal than 16: got ${hex.length} for hex = ${hex}`
      );
    }

    let n = new BN(hex, 16);
    if (n.isGreaterThan(MAX_FIXED8_HEX)) {
      // convert n to two complement
      n = n.minus(TOTAL_FIXED8_HEX);
    }
    n = n.div(DECIMALS);
    return new Fixed8(n, 10);
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

    if (this.isGreaterThan(Fixed8.MAX_VALUE)) {
      throw new Error(
        `expected input to be less than ${Fixed8.MAX_VALUE}. Got input = ${this}`
      );
    }
    if (this.isLessThan(Fixed8.MIN_VALUE)) {
      throw new Error(
        `expected input to be greater than ${Fixed8.MIN_VALUE}. Got input = ${this}`
      );
    }

    Object.setPrototypeOf(this, Fixed8.prototype);
  }

  public toHex(): string {
    let hexstring = "";
    const num = this.toRawNumber();

    hexstring = num.isLessThan(0)
      ? TOTAL_FIXED8_HEX.plus(num).toString(16) // convert num to two complement
      : num.toString(16);

    return "0".repeat(16 - hexstring.length) + hexstring;
  }

  public toReverseHex(): string {
    return reverseHex(this.toHex());
  }

  /**
   * Returns a raw number represetation of Fixed8.
   */
  public toRawNumber(): BN {
    return super.times(DECIMALS);
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
  public round(dp = 0, rm?: BN.RoundingMode): Fixed8 {
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
