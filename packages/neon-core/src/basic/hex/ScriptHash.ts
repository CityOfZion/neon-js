import { HexString } from "./HexString";
import { getScriptHashFromAddress } from "../../wallet";
import { Address } from "../Address";

export class ScriptHash extends HexString {
  protected _checkValue(value: string) {
    super._checkValue(value);
    if (value.length !== 40) {
      throw new Error(`value ${value} should be a 40-length hex`);
    }
  }

  public static fromHexString(str: string, littleEndian: boolean = false) {
    return new ScriptHash(str, littleEndian);
  }

  public static fromAddress(addr: Address, littleEndian: boolean = false) {
    return new ScriptHash(getScriptHashFromAddress(addr.value), littleEndian);
  }
}
