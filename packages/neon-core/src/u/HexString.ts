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

  protected constructor(value: string, littleEndian = false) {
    if (value.startsWith("0x")) {
      value = value.slice(2);
    }
    this._checkValue(value);
    this._value = littleEndian ? reverseHex(value) : value;
  }

  public toBigEndian(): string {
    return this._value;
  }

  public toLittleEndian(): string {
    return reverseHex(this._value);
  }

  public reverse(): this {
    this._value = reverseHex(this._value);
    return this;
  }

  public isEqualTo(other: HexString): boolean {
    return this.toBigEndian() === other.toBigEndian();
  }

  public xor(other: HexString): HexString {
    return HexString.fromHex(hexXor(this.toBigEndian(), other.toBigEndian()));
  }

  public toAscii(): string {
    return hexstring2str(this.toBigEndian());
  }

  public toNumber(): number {
    return parseInt(this.toBigEndian(), 16);
  }

  public toArrayBuffer(): Uint8Array {
    return hexstring2ab(this.toBigEndian());
  }

  public static fromHex(str: string, littleEndian = false) {
    return new HexString(str, littleEndian);
  }

  public static fromAscii(str: string) {
    const hex = str2hexstring(str);
    return new HexString(hex);
  }

  public static fromNumber(num: number, littleEndian = false) {
    return new HexString(num2hexstring(num), littleEndian);
  }

  public static fromArrayBuffer(
    arr: ArrayBuffer | ArrayLike<number>,
    littleEndian = false
  ) {
    return new HexString(ab2hexstring(arr), littleEndian);
  }
}
