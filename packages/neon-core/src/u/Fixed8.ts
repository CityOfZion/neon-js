import BN from "bn.js";
import { reverseHex } from "./misc";

const DECIMALS = 100000000;

// This is the maximum hex integer 0x7fffffffffffffff (= 9223372036854775807)
// that can be converted to Fixed8 by dividing by the 10^8.
const MAX_FIXED8_HEX = new BN(2).pow(new BN(63)).subn(1);
const MAX_FIXED8_NUM = MAX_FIXED8_HEX.divn(DECIMALS);

// This is the minimum hex integer 0x8000000000000000 (= -9223372036854775808)
// that can be converted to Fixed8 by dividing by the 10^8.
const MIN_FIXED8_HEX = new BN(2).pow(new BN(63)).neg();
const MIN_FIXED8_NUM = MIN_FIXED8_HEX.divn(DECIMALS);

// Total number of Fixed8 available. This includes negative and positive
// Fixed8 numbers.
const TOTAL_FIXED8_HEX = new BN(2).pow(new BN(64));

/**
 * A fixed point notation used widely in the NEO system for representing decimals.
 * It uses a signed 64-bit integer divided by 10^8. This allows it to accurately represent 8 decimal places.
 * Supports up to 8 decimals and is 8 bytes long.
 *
 * @example
 * const zero = new Fixed8();
 * const fromNumber = new Fixed8(12345);
 * const fromString = new Fixed8("12345");
 * const fromHex = Fixed8.fromHex("3039");
 * const fromReverseHex = Fixed8.fromReverseHex("3930");
 *
 */
export class Fixed8 {
  /**
   * Maximum value that a Fixed8 can hold (92233720368.54775807).
   */
  public static readonly MAX_VALUE = new Fixed8(
    MAX_FIXED8_HEX.divn(DECIMALS).toString()
  );

  /**
   * Minimum value that a Fixed8 can hold (-9223372036854775808).
   */
  public static readonly MIN_VALUE = new Fixed8(
    MIN_FIXED8_HEX.divn(DECIMALS).toString()
  );

  public static fromHex(hex: string): Fixed8 {
    if (hex.length > 16) {
      throw new Error(
        `expected hex string to have length less or equal than 16: got ${hex.length} for hex = ${hex}`
      );
    }

    const n = new BN(hex, 16);
    if (n.gt(MAX_FIXED8_HEX)) {
      // convert n to two complement
      n.isub(TOTAL_FIXED8_HEX);
    }
    n.idivn(DECIMALS);
    return new Fixed8(n.toString());
  }

  public static fromReverseHex(hex: string): Fixed8 {
    return this.fromHex(reverseHex(hex));
  }

  /**
   * Creates a new Fixed8 from a number that is too large to fit in a Fixed8.
   *
   * @remarks
   * The constructor of Fixed8 only accepts input between the MAX_VALUE and MIN_VALUE.
   * However, some inputs from RPC are larger than that due to them sending the raw value over.
   * This method allows the creation of the Fixed8 by stating the number of decimals to shift.
   * If after shifting the number is still out of range, this method will throw.
   *
   * @param input - a string or number that represents a number too big for a Fixed8.
   * @param decimals - the number of decimals to shift by. We will simply divide the number by 10^decimals. Defaults to 8.
   *
   * @example
   * const rawValue = "922337203680"; // RPC may send this value representing 9223.37203680 GAS.
   *
   * const safe = Fixed8.fromRawNumber(rawValue, 8);
   * console.log(safe.toString()); // 9223.37203680
   *
   * const willThrow = new Fixed8(rawValue);
   */
  public static fromRawNumber(input: string | number, decimals = 8): Fixed8 {
    return new Fixed8(
      new BN(input).div(new BN(10).pow(new BN(decimals))).toString()
    );
  }

  #val: BN;

  public constructor();
  public constructor(input: number | string | Fixed8);
  public constructor(input: number | string, base?: number);
  public constructor(input?: number | string | Fixed8, base = 10) {
    if (!input) {
      this.#val = new BN(0);
    } else if (typeof input === "number") {
      this.#val = new BN(input.toFixed(8), base);
    } else if (input instanceof Fixed8) {
      this.#val = input.#val.clone();
      return;
    } else {
      this.#val = new BN(input, base);
    }

    if (this.#val.gt(MAX_FIXED8_NUM)) {
      throw new Error(
        `expected input to be less than ${MAX_FIXED8_NUM.toString()}. Got input = ${this}`
      );
    }
    if (this.#val.lt(MIN_FIXED8_NUM)) {
      throw new Error(
        `expected input to be greater than ${MIN_FIXED8_NUM.toString()}. Got input = ${this}`
      );
    }
  }

  private static _parse(i: number | string | Fixed8): BN {
    return i instanceof Fixed8 ? i.#val : new BN(i);
  }

  public clone(): Fixed8 {
    return new Fixed8(this);
  }

  public toHex(): string {
    return this.#val.toTwos(8).toString("hex");
  }

  public toReverseHex(): string {
    return reverseHex(this.toHex());
  }

  /**
   * Returns a raw number representation of Fixed8.
   */
  public toRawNumber(): string {
    return this.#val.muln(DECIMALS).toString();
  }

  public toNumber(): number {
    return this.#val.toNumber();
  }

  public mod(n: string | number | Fixed8): Fixed8 {
    return new Fixed8(this.#val.mod(Fixed8._parse(n)).toString());
  }

  /**
   * Returns a Fixed8 whose value is rounded upwards to the next whole number.
   */
  public ceil(): Fixed8 {
    return this.#val.mod(new BN(1)).gtn(0)
      ? new Fixed8(this.#val.divn(1).addn(1).toString())
      : new Fixed8(this.#val.divn(1).toString());
  }

  /**
   * Returns a Fixed8 whose value is rounded downwards to the previous whole number.
   */
  public floor(): Fixed8 {
    return new Fixed8(this.#val.divn(1).toString());
  }

  /**
   * Returns true if the value is equivalent.
   */
  public equals(other: string | number | Fixed8): boolean {
    return this.#val.eq(Fixed8._parse(other));
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 divided by `n`
   */
  public dividedBy(n: string | number | Fixed8): Fixed8 {
    return new Fixed8(this.#val.div(Fixed8._parse(n)).toString());
  }

  /**
   * {@inheritDoc Fixed8.dividedBy}
   */
  public div(n: string | number | Fixed8): Fixed8 {
    return this.dividedBy(n);
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 multipled by `n`
   */
  public times(n: string | number | Fixed8): Fixed8 {
    return new Fixed8(this.#val.mul(Fixed8._parse(n)).toString());
  }

  /**
   * {@inheritDoc Fixed8.times}
   */
  public mul(n: string | number | Fixed8): Fixed8 {
    return this.times(n);
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 plus `n`
   */
  public plus(n: string | number | Fixed8): Fixed8 {
    return new Fixed8(this.#val.add(Fixed8._parse(n)).toString());
  }

  /**
   * {@inheritDoc Fixed8.plus}
   */
  public add(n: string | number | Fixed8): Fixed8 {
    return this.plus(n);
  }

  /**
   * Returns a Fixed8 whose value is the value of this Fixed8 minus `n`
   */
  public minus(n: string | number | Fixed8): Fixed8 {
    return new Fixed8(this.#val.sub(Fixed8._parse(n)).toString());
  }

  /**
   * {@inheritDoc Fixed8.minus}
   */
  public sub(n: string | number | Fixed8): Fixed8 {
    return this.minus(n);
  }

  public isZero(): boolean {
    return this.#val.isZero();
  }

  public gt(i: string | number | Fixed8): boolean {
    return this.#val.gt(Fixed8._parse(i));
  }

  public gte(i: string | number | Fixed8): boolean {
    return this.#val.gte(Fixed8._parse(i));
  }

  public lt(i: string | number | Fixed8): boolean {
    return this.#val.lt(Fixed8._parse(i));
  }

  public lte(i: string | number | Fixed8): boolean {
    return this.#val.lte(Fixed8._parse(i));
  }
}

export default Fixed8;
