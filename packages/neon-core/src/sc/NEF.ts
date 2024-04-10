import {
  StringStream,
  HexString,
  ab2hexstring,
  num2hexstring,
  str2hexstring,
  num2VarInt,
  hash256,
  serializeArrayOf,
} from "../u";
import { MethodTokenLike, MethodTokenJson, MethodToken } from "./MethodToken";

export interface NEFLike {
  compiler: string;
  source: string;
  tokens: MethodTokenLike[];
  /** Base64 encoded string */
  script: string;
}

export interface NEFJson {
  magic: number;
  compiler: string;
  source: string;
  tokens: MethodTokenJson[];
  /** Base64 encoded string */
  script: string;
  checksum: number;
}

export class NEF {
  private static MAX_SCRIPT_LENGTH = 512 * 1024;
  public static MAGIC = 0x3346454e;
  public compiler: string;
  public source: string;
  public tokens: MethodToken[];
  public script: string;
  #checksum?: number;

  public get checksum(): number {
    if (!this.#checksum) {
      this.#checksum = this.computeCheckSum();
    }
    return this.#checksum;
  }

  public constructor(obj: Partial<NEFLike>) {
    const { compiler = "", source = "", tokens = [], script = "" } = obj;
    this.compiler = compiler;
    this.source = source;
    this.tokens = tokens.map((token) => new MethodToken(token));
    this.script = script;
  }

  public static fromJson(json: NEFJson): NEF {
    if (json.magic !== this.MAGIC) {
      throw new Error("Incorrect magic");
    }

    const nef = new NEF({
      compiler: json.compiler,
      source: json.source,
      tokens: json.tokens.map((t) => MethodToken.fromJson(t)),
      script: json.script,
    });

    if (nef.checksum !== json.checksum) {
      throw new Error("Invalid checksum");
    }

    return nef;
  }

  public static fromBuffer(data: Buffer): NEF {
    const reader = new StringStream(ab2hexstring(data));

    const magic = HexString.fromHex(reader.read(4), true).toNumber();
    if (magic !== this.MAGIC)
      throw new Error("NEF deserialization failure - incorrect magic");

    const compilerHexArray = Buffer.from(reader.read(64), "hex");
    const idx = compilerHexArray.indexOf(0x0);
    const compiler =
      idx === -1
        ? compilerHexArray.toString()
        : compilerHexArray.slice(0, idx).toString();

    const sourceSize = reader.readVarInt();
    if (sourceSize > 256)
      throw new Error(
        "NEF deserialization failure - source field size exceeds maximum length of 256"
      );
    const source = Buffer.from(reader.read(sourceSize), "hex").toString();

    if (reader.read(1) !== "00")
      throw new Error("NEF deserialization failure - reserved bytes must be 0");

    const tokenLength = reader.readVarInt();
    if (tokenLength > 128)
      throw new Error(
        "NEF deserialization failure - token array exceeds maximum length of 128"
      );
    const tokens = [];
    for (let i = 0; i < tokenLength; i++) {
      tokens.push(MethodToken.fromStream(reader));
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

    const nef = new NEF({
      compiler: compiler,
      source: source,
      tokens: tokens,
      script: script,
    });

    if (nef.checksum !== checksum) {
      throw new Error("NEF deserialization failure - invalid checksum");
    }

    return nef;
  }

  public toJson(): NEFJson {
    return {
      magic: NEF.MAGIC,
      compiler: this.compiler,
      source: this.source,
      tokens: this.tokens.map((t) => t.toJson()),
      script: this.script,
      checksum: this.checksum,
    };
  }

  public get size(): number {
    return this.serialize().length;
  }

  private serializeWithoutChecksum(): string {
    let out = "";
    out += num2hexstring(NEF.MAGIC, 4, true);
    out += str2hexstring(this.compiler).padEnd(128, "0");
    out += num2VarInt(this.source.length);
    out += str2hexstring(this.source);
    out += "00"; // reserved
    out += serializeArrayOf(this.tokens);
    out += "0000"; // reserved
    out += num2VarInt(this.script.length / 2);
    out += this.script;
    return out;
  }

  public serialize(): string {
    let out = this.serializeWithoutChecksum();
    out += num2hexstring(this.checksum, 4, true);
    return out;
  }

  public export(): NEFLike {
    return {
      compiler: this.compiler,
      source: this.source,
      tokens: this.tokens.map((t) => t.export()),
      script: this.script,
    };
  }

  private computeCheckSum(): number {
    const data = this.serializeWithoutChecksum();
    const hash = hash256(data);
    return Buffer.from(hash, "hex").readUInt32LE();
  }
}

export default NEF;
