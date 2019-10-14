import { ScriptHash } from "./hex/ScriptHash";
import { getAddressFromScriptHash } from "../wallet";

export class Address {
  private _value: string;

  private _checkValue(value: string) {
    if (value.length !== 34) {
      throw new Error(`Address value length should be 34: ${value}`);
    }
  }

  private constructor(value: string) {
    this._checkValue(value);
    this._value = value;
  }

  public get value(): string {
    return this._value;
  }

  public static from(value: string) {
    return new Address(value);
  }

  public static fromScriptHash(sh: ScriptHash) {
    const scriptHashInLittleEndian = sh.value(true);
    return new Address(getAddressFromScriptHash(scriptHashInLittleEndian));
  }
}
