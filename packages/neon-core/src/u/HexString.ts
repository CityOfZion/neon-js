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

  /**
   * Export hex value as string
   * @param asLittleEndian true, export as a little-endian string; false, export as a big-endian string; default to be false
   * @returns string
   */
  public export(asLittleEndian = false): string {
    return asLittleEndian ? reverseHex(this._value) : this._value;
  }

  public reverse(): this {
    this._value = reverseHex(this._value);
    return this;
  }

  public isEqualTo(other: HexString): boolean {
    return this.export() === other.export();
  }

  public xor(other: HexString): HexString {
    return HexString.fromHex(hexXor(this.export(), other.export()));
  }

  public toAscii(): string {
    return hexstring2str(this.export());
  }

  public toNumber(): number {
    return parseInt(this.export(), 16);
  }

  public toArrayBuffer(): Uint8Array {
    return hexstring2ab(this.export());
  }

  public static fromHex(str: string, littleEndian = false) {
    return new HexString(str, littleEndian);
  }

  public static fromAscii(str: string) {
    const hex = str2hexstring(str);
    return new HexString(hex);
  }

  public static fromNumber(num: number) {
    return new HexString(num2hexstring(num));
  }

  public static fromArrayBuffer(arr: ArrayBuffer | ArrayLike<number>) {
    return new HexString(ab2hexstring(arr));
  }
}
