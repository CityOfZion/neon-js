import {
  hexstring2str,
  num2hexstring,
  num2VarInt,
  str2hexstring,
  StringStream,
} from "../u";
import { CallFlags } from "./CallFlags";

export interface MethodTokenLike {
  /** 0x prefixed hexstring */
  hash: string;
  method: string;
  parametersCount: number;
  hasReturnValue: boolean;
  callFlags: CallFlags;
}

export interface MethodTokenJson {
  /** 0x prefixed hexstring */
  hash: string;
  method: string;
  parameterscount: number;
  hasreturnvalue: boolean;
  callflags: CallFlags;
}

export class MethodToken {
  public hash: string;
  public method: string;
  public parametersCount: number;
  public hasReturnValue: boolean;
  public callFlags: CallFlags;

  public constructor(obj: Partial<MethodTokenLike>) {
    const {
      hash = "",
      method = "",
      parametersCount = 0,
      hasReturnValue = false,
      callFlags = CallFlags.None,
    } = obj;

    this.hash = hash;
    this.method = method;
    this.parametersCount = parametersCount;
    this.hasReturnValue = hasReturnValue;
    this.callFlags = callFlags;
  }

  public static fromJson(json: MethodTokenJson): MethodToken {
    return new MethodToken({
      hash: json.hash,
      method: json.method,
      parametersCount: json.parameterscount,
      hasReturnValue: json.hasreturnvalue,
      callFlags: json.callflags,
    });
  }

  public static fromStream(reader: StringStream): MethodToken {
    const hash = reader.read(20);
    const method = hexstring2str(reader.readVarBytes());
    if (method.startsWith("_"))
      throw new Error(
        "MethodToken deserialization failure - method cannot start with '_'",
      );
    const parametersCount = Buffer.from(reader.read(2), "hex").readUInt16LE();
    const hasReturnValue = reader.read(1) !== "00";
    const flags = Number.parseInt(reader.read(1), 16) as CallFlags;
    return new MethodToken({
      hash: hash,
      method: method,
      parametersCount: parametersCount,
      hasReturnValue: hasReturnValue,
      callFlags: flags,
    });
  }

  public toJson(): MethodTokenJson {
    return {
      hash: this.hash,
      method: this.method,
      parameterscount: this.parametersCount,
      hasreturnvalue: this.hasReturnValue,
      callflags: this.callFlags,
    };
  }

  public get size(): number {
    return this.serialize().length;
  }

  public serialize(): string {
    let out = "";
    out += this.hash;
    out += num2VarInt(this.method.length);
    out += str2hexstring(this.method);
    out += num2hexstring(this.parametersCount, 2, true);
    out += this.hasReturnValue ? "01" : "00";
    out += num2hexstring(this.callFlags);
    return out;
  }

  public export(): MethodTokenLike {
    return {
      hash: this.hash,
      method: this.method,
      parametersCount: this.parametersCount,
      hasReturnValue: this.hasReturnValue,
      callFlags: this.callFlags,
    };
  }
}

export default MethodToken;
