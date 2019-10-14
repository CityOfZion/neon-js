import { isHex, str2hexstring, num2hexstring, reverseHex } from "../../u";

export class HexString {
  private _value: string;
  private _littleEndian: boolean;

  protected _checkValue(value: string) {
    if (!isHex(value)) {
      throw new Error(`${value} is not hex`);
    }
  }

  protected constructor(value: string, littleEndian: boolean) {
    if (value.startsWith("0x")) {
      value = value.slice(2);
    }
    this._checkValue(value);
    this._value = value;
    this._littleEndian = littleEndian;
  }

  public value(asLittleEndian: boolean = false): string {
    if (this._littleEndian === asLittleEndian) {
      return this._value;
    } else {
      return reverseHex(this._value);
    }
  }

  public get isLittleEndian(): boolean {
    return this._littleEndian;
  }

  public isEqualTo(other: HexString): boolean {
    return this.value() === other.value();
  }

  public static fromASCIIString(str: string, littleEndian: boolean = false) {
    const hex = str2hexstring(str);
    return new HexString(littleEndian ? reverseHex(hex) : hex, littleEndian);
  }

  public static fromHexString(str: string, littleEndian: boolean = false) {
    return new HexString(str, littleEndian);
  }

  public static fromNumber(num: number, littleEndian: boolean = false) {
    return new HexString(num2hexstring(num, 1, littleEndian), littleEndian);
  }
}
