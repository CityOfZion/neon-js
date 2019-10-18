import { ensureHex, reverseHex, hexXor } from "./misc";
import {
  str2hexstring,
  num2hexstring,
  hexstring2ab,
  ab2hexstring,
  hexstring2str
} from "./convert";

export class HexString {
  /**
   * Will store value in big endian
   */
  private _value: string;

  protected _checkValue(value: string) {
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
    this._checkValue(value);
    this._value = littleEndian ? reverseHex(value) : value;
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
  public equals(other: HexString): boolean {
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
   */
  public toNumber(): number {
    return parseInt(this.toBigEndian(), 16);
  }

  /**
   * Export to ArrayBuffer in Uint8Array
   */
  public toArrayBuffer(): Uint8Array {
    return hexstring2ab(this.toBigEndian());
  }

  /**
   * Get HexString instance from a hex string
   * @param str hex string
   * @param littleEndian whether `str` is little endian
   */
  public static fromHex(str: string, littleEndian = false) {
    return new HexString(str, littleEndian);
  }

  /**
   * Get HexString instance from a ASCII string
   * @param str
   */
  public static fromAscii(str: string) {
    const hex = str2hexstring(str);
    return new HexString(hex);
  }

  /**
   * Get HexString instance from a number
   * @param num
   * @param littleEndian whether `num` is little endian
   */
  public static fromNumber(num: number, littleEndian = false) {
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
  ) {
    return new HexString(ab2hexstring(arr), littleEndian);
  }
}
