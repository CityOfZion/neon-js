import { reverseHex } from "./misc";
import BN from "bn.js";
import { HexString } from "./HexString";
/**
 * This is a BigInteger representation.
 */
export class BigInteger {
  /** Internal holding value. */
  #value: BN;

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

  public toHex(): string {
    return this.#value.toString(16);
  }

  public toTwos(): string {
    const result = this.#value
      .toTwos(getBytesForTwos(this.#value) * 8)
      .toString(16);
    return result.length % 2 !== 0 ? "0" + result : result;
  }

  public toReverseHex(): string {
    return reverseHex(this.toHex());
  }

  public toString(): string {
    return this.#value.toString();
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
