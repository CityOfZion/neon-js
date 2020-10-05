import { reverseHex } from "./misc";
import BN from "bn.js";
import { HexString } from "./HexString";

/**
 * This is a BigInteger representation, providing several helper methods to convert between different formats as well as basic math operations.
 */
export class BigInteger {
  /** Internal holding value. */
  #value: BN;

  /**
   * Creates a BigInteger from a twos complement hexstring.
   * @param hexstring - HexString class or a bigendian string.
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
   * // Apply a second paramter when using little endian.
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
   * Returns a little endian hex representation of the integer.
   * Does not come with a prefix.
   */
  public toReverseHex(): string {
    return reverseHex(this.toHex());
  }

  /**
   * Returns the arabic numerical representation of the integer as a string.
   */
  public toString(): string {
    return this.#value.toString();
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
