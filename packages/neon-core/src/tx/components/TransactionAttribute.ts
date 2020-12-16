import { num2hexstring, num2VarInt, StringStream, HexString } from "../../u";
import { TxAttrUsage } from "./txAttrUsage";
import { NeonObject } from "../../model";

const maxTransactionAttributeSize = 252;

export interface TransactionAttributeLike {
  usage: number | string;
  data: string | HexString;
}

export interface TransactionAttributeJson {
  // Name of TransactionAttributeUsage in English
  usage: string;
  // Base64-encoded data
  data: string;
}

export function toTxAttrUsage(
  type: TxAttrUsage | string | number
): TxAttrUsage {
  if (typeof type === "string") {
    if (type in TxAttrUsage) {
      return TxAttrUsage[type as keyof typeof TxAttrUsage];
    }
    throw new Error(`${type} not found in TxAttrUsage!`);
  } else if (typeof type === "number") {
    if (TxAttrUsage.Url !== type) {
      throw new Error(`${type} not found in TxAttrUsage!`);
    }
  }

  return type as TxAttrUsage;
}

/**
 * An attribute that is used to decorate the transaction.
 * Used for appending additional information to the transaction.
 *
 * For example, a remark is attached as an attribute.
 */
export class TransactionAttribute
  implements NeonObject<TransactionAttributeLike> {
  public static deserialize(hex: string): TransactionAttribute {
    const ss = new StringStream(hex);
    return this.fromStream(ss);
  }

  public static fromJson(
    input: TransactionAttributeJson
  ): TransactionAttribute {
    return new TransactionAttribute({
      usage: toTxAttrUsage(input.usage),
      data: HexString.fromBase64(input.data, true),
    });
  }

  public static fromStream(ss: StringStream): TransactionAttribute {
    const usage = parseInt(ss.read(1), 16);
    const data: string = ss.readVarBytes();
    if (data.length > maxTransactionAttributeSize * 2) {
      throw new Error("Data too big! Only 252 bytes allowed in data");
    }
    return new TransactionAttribute({ usage, data });
  }

  public usage: TxAttrUsage;

  /**
   * data in hex format
   */
  public data: HexString;

  public constructor(
    obj: Partial<TransactionAttributeLike | TransactionAttribute> = {}
  ) {
    if (!obj.usage || !obj.data) {
      throw new Error("TransactionAttribute requires usage and data fields");
    }
    const { usage, data } = obj;
    this.usage = toTxAttrUsage(usage);
    this.data = HexString.fromHex(data);
  }

  public get size(): number {
    return (
      1 + num2VarInt(this.data.byteLength).length / 2 + this.data.byteLength
    );
  }

  /**
   * Constructs a Url Attribute
   * @param url - URL string in ASCII
   */
  public static Url(url: string): TransactionAttribute {
    return new TransactionAttribute({
      usage: TxAttrUsage.Url,
      data: HexString.fromAscii(url),
    });
  }

  public get [Symbol.toStringTag](): string {
    return "TransactionAttribute";
  }

  public serialize(): string {
    if (this.data.length > maxTransactionAttributeSize) {
      throw new Error(`Data size too big!`);
    }
    let out = num2hexstring(this.usage);
    out += num2VarInt(this.data.byteLength);
    out += this.data;
    return out;
  }

  public export(): TransactionAttributeLike {
    return {
      usage: this.usage,
      data: this.data.toBigEndian(),
    };
  }

  public toJson(): TransactionAttributeJson {
    return {
      usage: TxAttrUsage[this.usage],
      data: this.data.toBase64(true),
    };
  }

  public equals(
    other: Partial<TransactionAttributeLike | TransactionAttribute>
  ): boolean {
    return (
      this.usage === toTxAttrUsage(other.usage ?? 0) &&
      this.data.equals(other.data ?? "")
    );
  }
}

export default TransactionAttribute;
