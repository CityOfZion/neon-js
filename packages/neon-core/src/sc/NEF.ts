import { u } from "../";
import { num2hexstring, num2VarInt } from "../u";
import { serializeArrayOf } from "../tx/lib";
export enum CallFlags {
  None = 0,
  ReadStates = 0b00000001,
  WriteStates = 0b00000010,
  AllowCall = 0b00000100,
  AllowNotify = 0b00001000,
  States = ReadStates | WriteStates,
  ReadOnly = ReadStates | AllowCall,
  All = States | AllowCall | AllowNotify,
}

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

  public static fromStream(reader: u.StringStream): MethodToken {
    const hash = reader.read(20);
    const method = u.hexstring2str(reader.readVarBytes());
    if (method.startsWith("_"))
      throw new Error(
        "MethodToken deserialization failure - method cannot start with '_'"
      );
    const parametersCount = Buffer.from(reader.read(2), "hex").readUInt16LE();
    const hasReturnValue = reader.read(1) != "00";
    const flags = Number.parseInt(reader.read(1)) as CallFlags;
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
    out += this.method;
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

export interface NEFLike {
  magic?: number;
  compiler: string;
  tokens: MethodTokenLike[];
  /** Base64 encoded string */
  script: string;
  checksum: number;
}

export interface NEFJson {
  magic: number;
  compiler: string;
  tokens: MethodTokenJson[];
  /** Base64 encoded string */
  script: string;
  checksum: number;
}

export class NEF {
  public magic: number;
  public compiler: string;
  public tokens: MethodToken[];
  public script: string;
  public checksum: number;

  public constructor(obj: Partial<NEFLike>) {
    const {
      magic = 0x3346454e,
      compiler = "",
      tokens = [],
      script = "",
      checksum = 0,
    } = obj;
    this.magic = magic;
    this.compiler = compiler;
    this.tokens = tokens.map((token) => new MethodToken(token));
    this.script = script;
    this.checksum = checksum;
  }

  public static fromJson(json: NEFJson): NEF {
    return new NEF({
      magic: json.magic,
      compiler: json.compiler,
      tokens: json.tokens.map((t) => MethodToken.fromJson(t)),
      script: json.script,
      checksum: json.checksum,
    });
  }

  public static fromBuffer(data: Buffer): NEF {
    const reader = new u.StringStream(u.ab2hexstring(data));

    const magic = u.HexString.fromHex(reader.read(4), true).toNumber();
    if (magic != 0x3346454e)
      throw new Error("NEF deserialization failure - incorrect magic");

    const compiler = u.hexstring2str(reader.read(64));

    if (reader.read(2) !== "0000")
      throw new Error("NEF deserialization failure - reserved bytes must be 0");

    const token_length = reader.readVarInt();
    if (token_length > 128)
      throw new Error(
        "NEF deserialization failure - token array exceeds maximum length of 128"
      );
    const tokens = [];
    for (let i = 0; i < token_length; i++) {
      tokens.push(MethodToken.fromStream(reader));
    }

    if (reader.read(2) !== "0000")
      throw new Error("NEF deserialization failure - reserved bytes must be 0");

    const script_length = reader.readVarInt();
    if (script_length == 0)
      throw new Error("NEF deserialization failure - script length can't be 0");
    if (script_length > 512 * 1024)
      throw new Error(
        "NEF deserialization failure - max script length exceeded"
      );
    const script = reader.read(script_length);

    const checksum = Buffer.from(reader.read(4), "hex").readUInt32LE();

    return new NEF({
      magic: magic,
      compiler: compiler,
      tokens: tokens,
      script: script,
      checksum: checksum,
    });
  }

  public toJson(): NEFJson {
    return {
      magic: this.magic,
      compiler: this.compiler,
      tokens: this.tokens.map((t) => t.toJson()),
      script: this.script,
      checksum: this.checksum,
    };
  }

  public get size(): number {
    return (
      32 + // magic
      64 + // compiler
      2 + // reserved
      u.getSerializedSize(this.tokens) +
      2 + // reserved
      u.getSerializedSize(u.HexString.fromHex(this.script)) +
      4
    ); // checksum
  }

  public serialize(): string {
    let out = "";
    out += num2hexstring(this.magic, 4, true);
    out += u.str2hexstring(this.compiler.padEnd(64, "0"));
    out += "0000"; // reserved
    out += serializeArrayOf(this.tokens);
    out += "0000"; // reserved
    out += num2VarInt(this.script.length / 2);
    out += this.script;
    out += num2hexstring(this.checksum, 4, true);
    return out;
  }

  public export(): NEFLike {
    return {
      magic: this.magic,
      compiler: this.compiler,
      tokens: this.tokens.map((t) => t.export()),
      script: this.script,
      checksum: this.checksum,
    };
  }
}

export default NEF;
