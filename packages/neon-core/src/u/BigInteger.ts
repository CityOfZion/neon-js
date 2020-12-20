import { reverseHex } from "./misc";
import BN from "bn.js";
import { HexString } from "./HexString";

/**
 * This is a BigInteger representation, providing several helper methods to convert between different formats as well as basic math operations.
 * Mainly used within the NEO VM for representing numbers.
 */
export class BigInteger {
  /** Internal holding value. */
  #value: BN;

  /**
   * Creates a BigInteger from a twos complement hexstring.
   * @param hexstring - HexString class or a string.
   * @param littleEndian - indicate if provided string is big or little endian. Defaults to false(big endian).
   *
   * @example
   * const negativeOne = BigInteger.fromTwos("ff");
   * const oneTwoEight = BigInteger.fromTwos("0080");
   *
   * // Apply a second parameter when using little endian.
   * const oneTwoEightAgain = BigInteger.fromTwos("8000", true);
   */
  public static fromTwos(hexstring: HexString): BigInteger;
  public static fromTwos(hexstring: string, littleEndian?: boolean): BigInteger;
  public static fromTwos(
    hexstring: string | HexString,
    littleEndian = false
  ): BigInteger {
    const cleanedInput =
      hexstring instanceof HexString
        ? hexstring
        : HexString.fromHex(hexstring, littleEndian);
    return new BigInteger(
      new BN(cleanedInput.toBigEndian(), 16).fromTwos(
        cleanedInput.byteLength * 8
      )
    );
  }

  /**
   * Creates a BigInteger from a hexstring.
   * @param hexstring - HexString class or a bigendian string.
   *
   * @example
   * const twoFiveFive = BigInteger.fromHex("ff");
   * const oneTwoEight = BigIntger.fromHex("80");
   * const oneTwoEightAgain = BigInteger.fromHex("0080");
   *
   * // Apply a second parameter when using little endian.
   * const oneSixThreeEightFour = BigInteger.fromHex("0040", true);
   */
  public static fromHex(hexstring: HexString): BigInteger;
  public static fromHex(hexstring: string, littleEndian?: boolean): BigInteger;
  public static fromHex(
    hexstring: string | HexString,
    littleEndian = false
  ): BigInteger {
    const cleanedInput =
      hexstring instanceof HexString
        ? hexstring
        : HexString.fromHex(hexstring, littleEndian);
    return new BigInteger(new BN(cleanedInput.toBigEndian(), 16));
  }

  /**
   * Creates a BigInteger from a number.
   * @param input - Javascript number or string containing numbers.
   *
   * @throws non-integer provided
   * @throws Input is not a stringified number.
   *
   * @example
   * const zero = BigInteger.fromNumber(0);
   * const negativeOne = BigInteger.fromNumber(-1);
   *
   * const usingString = BigInteger.fromNumber("-1");
   */
  public static fromNumber(input: number | string): BigInteger {
    switch (typeof input) {
      case "string":
        if (input.indexOf(".") !== -1) {
          throw new Error(`BigInteger only accepts integers. Got ${input}`);
        }
        return new BigInteger(new BN(input));
      case "number":
        if (input % 1 !== 0) {
          throw new Error(`BigInteger only accepts integers. Got ${input}`);
        }
        // We use hex notation here as toString occasionally outputs scientific notation.
        // eg. 9999999999999999999999999999999999.toString() == '1e+34'.
        return new BigInteger(new BN(input.toString(16), 16));
      default:
        throw new Error("Input was not stringified number or number");
    }
  }

  /**
   * Creates a BigInteger instance from a decimal by parsing the decimals and shifting the decimal point by a provided number of places.
   *
   * This is mainly used with dealing with Nep17 tokens.
   * While most tokens support some sort of decimal places, the data is actually stored as an integer.
   * This helper method converts the decimal number to the integer representation to work with.
   * To convert back, use toDecimal(decimals);
   * @param input - Javascript number or string containing numbers. Accepts decimals.
   * @param decimals - Number of decimal places to support.
   *
   * @example
   *
   * const transformedDecimal = BigInteger.fromDecimal(12.34,3);
   * console.log(transformedDecimal.toString()); // 12340
   *
   * const oneGas = BigInteger.fromDecimal(1,8);
   * console.log(oneGas); // 100000000
   */
  public static fromDecimal(
    input: number | string,
    decimals: number
  ): BigInteger {
    const stringNumber =
      typeof input === "number" ? input.toFixed(decimals) : input;

    const portions = stringNumber.split(".", 2);
    const leftOfDecimal = portions[0];
    const rightOfDecimal = portions.length === 2 ? portions[1] : "";

    // Throw if the right side is too long as it affects how we form the final number.
    if (rightOfDecimal.length > decimals) {
      throw new Error(
        `Input had more decimal places than provided. Got ${rightOfDecimal} but only got ${decimals} decimal places.`
      );
    }

    const finalNumber =
      leftOfDecimal +
      rightOfDecimal +
      "0".repeat(decimals - rightOfDecimal.length);
    return BigInteger.fromNumber(finalNumber);
  }

  private constructor(value: BN) {
    this.#value = value;
  }

  /**
   * Returns a big endian hex representation of the integer.
   * Does not come with a prefix.
   */
  public toHex(): string {
    const result = this.#value.toString(16);
    return result.length % 2 !== 0 ? "0" + result : result;
  }

  /**
   * Returns a little endian hex representation of the integer.
   * Does not come with a prefix.
   */
  public toReverseHex(): string {
    return reverseHex(this.toHex());
  }

  /**
   * Returns a big endian two's complement representation of the integer.
   * Does not come with a prefix.
   */
  public toTwos(): string {
    const byteLength = getBytesForTwos(this.#value);
    const result = this.#value
      .toTwos(byteLength * 8)
      .toString(16, byteLength * 2);
    return result.length % 2 !== 0 ? "0" + result : result;
  }

  /**
   * Returns a little endian two's complement representation of the integer.
   * Does not come with a prefix.
   */
  public toReverseTwos(): string {
    return reverseHex(this.toTwos());
  }

  /**
   * Returns the arabic numerical representation of the integer as a string.
   */
  public toString(): string {
    return this.#value.toString();
  }

  // We do not provide a toNumber() as it is unsafe conversion.

  /**
   * Converts the BigInteger into a decimal number by shifting the decimal place to the left.
   * @param decimals - Number of decimals places
   *
   * @example
   * const bigNumber = BigInteger.fromNumber(100000000);
   * console.log(bigNumber.toDecimal(8)); // 1.00000000
   */
  public toDecimal(decimals: number): string {
    if (decimals === 0) {
      return this.#value.toString();
    }
    const sign = this.#value.isNeg() ? "-" : "";
    const stringNumber = this.#value.abs().toString(10);
    if (stringNumber.length <= decimals) {
      return sign + "0." + stringNumber.padStart(decimals, "0");
    }
    const leftOfDecimal = stringNumber.slice(0, stringNumber.length - decimals);
    const rightOfDecimal = stringNumber.slice(leftOfDecimal.length);
    return sign + leftOfDecimal + "." + rightOfDecimal;
  }

  /**
   * Adds the other value to this value and returns the result as a new BigInteger.
   * @param other - other operand to add.
   */
  public add(other: BigInteger | number): BigInteger {
    const otherBigInteger =
      other instanceof BigInteger ? other : BigInteger.fromNumber(other);
    return new BigInteger(this.#value.add(otherBigInteger.#value));
  }

  /**
   * Subtracts the other value from this value and returns the result as a new BigInteger.
   * @param other - other operand to subtract.
   */
  public sub(other: BigInteger | number): BigInteger {
    const otherBigInteger =
      other instanceof BigInteger ? other : BigInteger.fromNumber(other);
    return new BigInteger(this.#value.sub(otherBigInteger.#value));
  }

  /**
   * Multiply the other value with this value and returns the result as a new BigInteger.
   * @param other - other operand to multiply.
   */
  public mul(other: BigInteger | number): BigInteger {
    const otherBigInteger =
      other instanceof BigInteger ? other : BigInteger.fromNumber(other);
    return new BigInteger(this.#value.mul(otherBigInteger.#value));
  }

  /**
   * Divides this value with the other value and returns the result as a new BigInteger.
   * There are no decimals and results are always rounded down.
   * @param other - other operand to divide.
   */
  public div(other: BigInteger | number): BigInteger {
    const otherBigInteger =
      other instanceof BigInteger ? other : BigInteger.fromNumber(other);
    return new BigInteger(this.#value.div(otherBigInteger.#value));
  }

  /**
   * Performs the MOD operation with the other value and returns the result as a new BigInteger.
   * @param other - other operand to perform mod.
   */
  public mod(other: BigInteger | number): BigInteger {
    const otherBigInteger =
      other instanceof BigInteger ? other : BigInteger.fromNumber(other);
    return new BigInteger(this.#value.mod(otherBigInteger.#value));
  }

  /**
   * Compares the two values and returns -1, 0, 1 if this value is larger, equal, smaller than the other value respectively.
   * @param other - other operand to compare against.
   */
  public compare(other: BigInteger | number): number {
    const otherBigInteger =
      other instanceof BigInteger ? other : BigInteger.fromNumber(other);
    return this.#value.cmp(otherBigInteger.#value);
  }

  public equals(other: BigInteger | number): boolean {
    return this.compare(other) === 0;
  }
}

//Memoization for twos
const twosComplementByteBounds = [
  [new BN(-128), new BN(127)],
  [new BN(-32768), new BN(32767)],
  [new BN(-8388608), new BN(8388607)],
];

function increaseBounds(): void {
  const nextBound = twosComplementByteBounds.length + 1;
  const power = new BN(nextBound * 8 - 1);
  twosComplementByteBounds.push([
    new BN(2).pow(power).neg(),
    new BN(2).pow(power).isubn(1),
  ]);
}
function isWithinBounds(value: BN, bounds: BN[]): boolean {
  return value.gte(bounds[0]) && value.lte(bounds[1]);
}

function getBytesForTwos(value: BN): number {
  // This is standard hex length. Twos complement is always equal or larger.
  let byteLength = value.byteLength();
  if (byteLength === 0) {
    return 0;
  }

  while (byteLength <= 32) {
    if (twosComplementByteBounds.length < byteLength) {
      increaseBounds();
      continue;
    }
    const bounds = twosComplementByteBounds[byteLength - 1];
    if (isWithinBounds(value, bounds)) {
      return byteLength;
    }
    byteLength++;
  }
  throw new Error("Number too large to convert!");
}
