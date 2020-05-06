import { ensureHex, reverseHex, hexXor } from "./misc";
import {
  str2hexstring,
  num2hexstring,
  hexstring2ab,
  ab2hexstring,
  hexstring2str,
} from "./convert";
import { base642hex, hex2base64 } from "./base64";

export class HexString {
  /**
   * Will store value in big endian
   */
  private _value: string;

  public get length(): number {
    return this._value.length;
  }

  public get byteLength(): number {
    return this._value.length / 2;
  }

  public assert(value: string): void {
    ensureHex(value);
  }

  /**
   * Initiate a HexString
   * @param value
   * @param littleEndian tell whether value is little endian or not. default to be false.
   */
  protected constructor(value: string, littleEndian = false) {
    if (value.startsWith("0x")) {
      value = value.slice(2);
    }
    this.assert(value);
    this._value = littleEndian ? reverseHex(value) : value;
  }

  public toString(): string {
    return this._value;
  }

  /**
   * Export as big endian string
   */
  public toBigEndian(): string {
    return this._value;
  }

  /**
   * Export as little endian string
   */
  public toLittleEndian(): string {
    return reverseHex(this._value);
  }

  /**
   * Judge if 2 HexString are equal
   * @param other
   */
  public equals(other: HexString | string): boolean {
    if (typeof other === "string") {
      return this.toBigEndian() === HexString.fromHex(other).toBigEndian();
    }
    return this.toBigEndian() === other.toBigEndian();
  }

  /**
   * XOR with another HexString to get a new one.
   * @param other
   */
  public xor(other: HexString): HexString {
    return HexString.fromHex(hexXor(this.toBigEndian(), other.toBigEndian()));
  }

  /**
   * Export as ASCII string
   */
  public toAscii(): string {
    return hexstring2str(this.toBigEndian());
  }

  /**
   * Export as number
   * @param asLittleEndian whether export as little endian number, default to be false
   */
  public toNumber(asLittleEndian = false): number {
    return parseInt(
      asLittleEndian ? this.toLittleEndian() : this.toBigEndian(),
      16
    );
  }

  /**
   * Export to ArrayBuffer in Uint8Array
   * @param asLittleEndian whether export as little endian array, default to be false
   */
  public toArrayBuffer(asLittleEndian = false): Uint8Array {
    return hexstring2ab(
      asLittleEndian ? this.toLittleEndian() : this.toBigEndian()
    );
  }

  /**
   * Export as a base64-encoded string.
   * @param asLittleEndian Whether to encode as little endian, default to be false
   */
  public toBase64(asLittleEndian = false): string {
    return hex2base64(
      asLittleEndian ? this.toLittleEndian() : this.toBigEndian()
    );
  }

  /**
   * Get HexString instance from a hex string
   * @param str hex string
   * @param littleEndian whether `str` is little endian
   */
  public static fromHex(str: string, littleEndian: boolean): HexString;
  public static fromHex(str: string | HexString): HexString;
  public static fromHex(
    str: string | HexString,
    littleEndian = false
  ): HexString {
    if (typeof str === "object" && str instanceof HexString) {
      return new HexString(str.toBigEndian());
    }
    return new HexString(str, littleEndian);
  }

  /**
   * Get HexString instance from a ASCII string
   * @param str
   */
  public static fromAscii(str: string): HexString {
    const hex = str2hexstring(str);
    return new HexString(hex);
  }

  /**
   * Get HexString instance from a number
   * @param num
   * @param littleEndian whether `num` is little endian
   */
  public static fromNumber(num: number, littleEndian = false): HexString {
    return new HexString(num2hexstring(num), littleEndian);
  }

  /**
   * Get HexString instance from array buffer
   * @param arr
   * @param littleEndian whether `arr` is little endian
   */
  public static fromArrayBuffer(
    arr: ArrayBuffer | ArrayLike<number>,
    littleEndian = false
  ): HexString {
    return new HexString(ab2hexstring(arr), littleEndian);
  }

  /**
   * Get HexString instance from a Base64-encoded string
   * @param encodedString
   * @param littleEndian Whether the decoded hexstring is little endian
   */
  public static fromBase64(
    encodedString: string,
    littleEndian = false
  ): HexString {
    return new HexString(base642hex(encodedString), littleEndian);
  }
}
