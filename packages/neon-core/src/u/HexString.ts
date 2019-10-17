import { ensureHex, reverseHex, hexXor } from "./misc";
import {
  str2hexstring,
  num2hexstring,
  hexstring2ab,
  ab2hexstring,
  hexstring2str
} from "./convert";

export class HexString {
  private _value: string;
  private _littleEndian: boolean;

  protected _checkValue(value: string) {
    ensureHex(value);
  }

  protected constructor(value: string, littleEndian = false) {
    if (value.startsWith("0x")) {
      value = value.slice(2);
    }
    this._checkValue(value);
    this._value = value;
    this._littleEndian = littleEndian;
  }

  /**
   * Get hex value as string
   * @param asLittleEndian true, export a little-endian string; false, export a big-endian string; default to be false
   * @returns string
   */
  public value(asLittleEndian = false): string {
    if (this._littleEndian === asLittleEndian) {
      return this._value;
    } else {
      return reverseHex(this._value);
    }
  }

  public reverse(): this {
    this._littleEndian = !this._littleEndian;
    return this;
  }

  public isEqualTo(other: HexString): boolean {
    return this.value() === other.value();
  }

  public xor(other: HexString): HexString {
    return HexString.fromHexString(hexXor(this.value(), other.value()));
  }

  public toASCIIString(): string {
    return hexstring2str(this.value());
  }

  public toNumber(): number {
    return parseInt(this.value(), 16);
  }

  public toArrayBuffer(): Uint8Array {
    return hexstring2ab(this.value());
  }

  public static fromHexString(str: string, littleEndian = false) {
    return new HexString(str, littleEndian);
  }

  public static fromASCIIString(str: string, littleEndian = false) {
    const hex = str2hexstring(str);
    return new HexString(littleEndian ? reverseHex(hex) : hex, littleEndian);
  }

  public static fromNumber(num: number, littleEndian = false) {
    return new HexString(num2hexstring(num, 1, littleEndian), littleEndian);
  }

  public static fromArrayBuffer(arr: ArrayBuffer | ArrayLike<number>) {
    return new HexString(ab2hexstring(arr));
  }
}
