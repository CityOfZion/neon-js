import { u, sc } from "../";
import { serializeArrayOf } from "../tx/lib";

export interface NEFLike {
  compiler: string;
  tokens: sc.MethodTokenLike[];
  /** Base64 encoded string */
  script: string;
  checksum: number;
}

export interface NEFJson {
  magic: number;
  compiler: string;
  tokens: sc.MethodTokenJson[];
  /** Base64 encoded string */
  script: string;
  checksum: number;
}

export class NEF {
  private static MAX_SCRIPT_LENGTH = 512 * 1024;
  public static MAGIC = 0x3346454e;
  public compiler: string;
  public tokens: sc.MethodToken[];
  public script: string;
  public checksum: number;

  public constructor(obj: Partial<NEFLike>) {
    const { compiler = "", tokens = [], script = "", checksum = 0 } = obj;
    this.compiler = compiler;
    this.tokens = tokens.map((token) => new sc.MethodToken(token));
    this.script = script;
    this.checksum = checksum;
  }

  public static fromJson(json: NEFJson): NEF {
    if (json.magic != this.MAGIC) {
      throw new Error("Incorrect magic");
    }
    return new NEF({
      compiler: json.compiler,
      tokens: json.tokens.map((t) => sc.MethodToken.fromJson(t)),
      script: json.script,
      checksum: json.checksum,
    });
  }

  public static fromBuffer(data: Buffer): NEF {
    const reader = new u.StringStream(u.ab2hexstring(data));

    const magic = u.HexString.fromHex(reader.read(4), true).toNumber();
    if (magic != this.MAGIC)
      throw new Error("NEF deserialization failure - incorrect magic");

    const tmp_compiler = Buffer.from(reader.read(64), "hex");
    const idx = tmp_compiler.indexOf(0x0);
    const compiler = tmp_compiler.slice(0, idx).toString();

    if (reader.read(2) !== "0000")
      throw new Error("NEF deserialization failure - reserved bytes must be 0");

    const tokenLength = reader.readVarInt();
    if (tokenLength > 128)
      throw new Error(
        "NEF deserialization failure - token array exceeds maximum length of 128"
      );
    const tokens = [];
    for (let i = 0; i < tokenLength; i++) {
      tokens.push(sc.MethodToken.fromStream(reader));
    }

    if (reader.read(2) !== "0000")
      throw new Error("NEF deserialization failure - reserved bytes must be 0");

    const scriptLength = reader.readVarInt();
    if (scriptLength === 0)
      throw new Error("NEF deserialization failure - script length can't be 0");
    if (scriptLength > this.MAX_SCRIPT_LENGTH)
      throw new Error(
        "NEF deserialization failure - max script length exceeded"
      );
    const script = reader.read(scriptLength);

    const checksum = Buffer.from(reader.read(4), "hex").readUInt32LE();

    return new NEF({
      compiler: compiler,
      tokens: tokens,
      script: script,
      checksum: checksum,
    });
  }

  public toJson(): NEFJson {
    return {
      magic: NEF.MAGIC,
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
    out += u.num2hexstring(NEF.MAGIC, 4, true);
    out += u.str2hexstring(this.compiler).padEnd(128, "0");
    out += "0000"; // reserved
    out += serializeArrayOf(this.tokens);
    out += "0000"; // reserved
    out += u.num2VarInt(this.script.length / 2);
    out += this.script;
    out += u.num2hexstring(this.checksum, 4, true);
    return out;
  }

  public export(): NEFLike {
    return {
      compiler: this.compiler,
      tokens: this.tokens.map((t) => t.export()),
      script: this.script,
      checksum: this.checksum,
    };
  }
}

export default NEF;
