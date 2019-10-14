import { HexString } from "./HexString";

export class PublicKey extends HexString {
  protected _checkValue(value: string) {
    super._checkValue(value);
    if (value.length !== 66) {
      throw new Error(`value ${value} should be a 66-length hex`);
    }
  }

  public static fromHexString(str: string, littleEndian: boolean = false) {
    return new PublicKey(str, littleEndian);
  }
}
