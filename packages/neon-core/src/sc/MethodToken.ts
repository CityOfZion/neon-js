import { u, sc } from "../";

export interface MethodTokenLike {
  /** 0x prefixed hexstring */
  hash: string;
  method: string;
  parametersCount: number;
  hasReturnValue: boolean;
  callFlags: sc.CallFlags;
}

export interface MethodTokenJson {
  /** 0x prefixed hexstring */
  hash: string;
  method: string;
  parameterscount: number;
  hasreturnvalue: boolean;
  callflags: sc.CallFlags;
}

export class MethodToken {
  public hash: string;
  public method: string;
  public parametersCount: number;
  public hasReturnValue: boolean;
  public callFlags: sc.CallFlags;

  public constructor(obj: Partial<MethodTokenLike>) {
    const {
      hash = "",
      method = "",
      parametersCount = 0,
      hasReturnValue = false,
      callFlags = sc.CallFlags.None,
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

  public static fromStream(reader: u.StringStream): MethodToken {
    const hash = reader.read(20);
    const method = u.hexstring2str(reader.readVarBytes());
    if (method.startsWith("_"))
      throw new Error(
        "MethodToken deserialization failure - method cannot start with '_'"
      );
    const parametersCount = Buffer.from(reader.read(2), "hex").readUInt16LE();
    const hasReturnValue = reader.read(1) !== "00";
    const flags = Number.parseInt(reader.read(1)) as sc.CallFlags;
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
    out += u.num2VarInt(this.method.length);
    out += u.str2hexstring(this.method);
    out += u.num2hexstring(this.parametersCount, 2, true);
    out += this.hasReturnValue ? "01" : "00";
    out += u.num2hexstring(this.callFlags);
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
