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
   * const oneZeroTwoFour = BigInteger.fromHex("0040", true);
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
        return new BigInteger(new BN(input));
      case "number":
        if (input % 1 !== 0) {
          throw new Error(`BigInteger only accepts integers. Got ${input}`);
        }
        if (input > Number.MAX_SAFE_INTEGER) {
          return new BigInteger(new BN(input.toString()));
        }
        return new BigInteger(new BN(input));
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
    return this.#value.toString(16);
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
    return new BigInteger(
      other instanceof BigInteger
        ? this.#value.add(other.#value)
        : this.#value.addn(other)
    );
  }

  /**
   * Subtracts the other value from this value and returns the result as a new BigInteger.
   * @param other - other operand to subtract.
   */
  public sub(other: BigInteger): BigInteger {
    return new BigInteger(
      other instanceof BigInteger
        ? this.#value.sub(other.#value)
        : this.#value.subn(other)
    );
  }

  /**
   * Multiply the other value with this value and returns the result as a new BigInteger.
   * @param other - other operand to multiply.
   */
  public mul(other: BigInteger): BigInteger {
    return new BigInteger(
      other instanceof BigInteger
        ? this.#value.mul(other.#value)
        : this.#value.muln(other)
    );
  }

  /**
   * Divides this value with the other value and returns the result as a new BigInteger.
   * There are no decimals and results are always rounded down.
   * @param other - other operand to divide.
   */
  public div(other: BigInteger): BigInteger {
    return new BigInteger(
      other instanceof BigInteger
        ? this.#value.div(other.#value)
        : this.#value.divn(other)
    );
  }

  /**
   * Performs the MOD operation with the other value and returns the result as a new BigInteger.
   * @param other - other operand to perform mod.
   */
  public mod(other: BigInteger): BigInteger {
    return new BigInteger(
      other instanceof BigInteger
        ? this.#value.mod(other.#value)
        : this.#value.mod(new BN(other))
    );
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
