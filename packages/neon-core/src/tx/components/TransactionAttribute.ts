import { num2hexstring, num2VarInt, StringStream } from "../../u";
import { TxAttrUsage } from "./txAttrUsage";
import { HexString } from "../../basic/hex/HexString";

const maxTransactionAttributeSize = 65535;

export interface TransactionAttributeLike {
  usage: number | string;
  data: string;
}

export interface TransactionAttributeConfig {
  usage: TxAttrUsage | number | string;
  data: HexString;
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
export class TransactionAttribute {
  public static deserialize(hex: string): TransactionAttribute {
    const ss = new StringStream(hex);
    return this.fromStream(ss);
  }

  public static fromStream(ss: StringStream): TransactionAttribute {
    const usage = parseInt(ss.read(1), 16);
    let data: HexString = HexString.fromHexString(ss.readVarBytes());
    return new TransactionAttribute({ usage, data });
  }

  public usage: TxAttrUsage;

  /**
   * @description data in hex format
   */
  public data: HexString;

  public constructor(obj: TransactionAttributeConfig) {
    if (!obj || obj.usage === undefined || obj.data === undefined) {
      throw new Error("TransactionAttribute requires usage and data fields");
    }
    const { usage, data } = obj;
    this.usage = toTxAttrUsage(usage);
    this.data = data;
  }

  /**
   * @param url url string in ASCII format
   */
  public static Url(url: string): TransactionAttribute {
    return new TransactionAttribute({
      usage: TxAttrUsage.Url,
      data: HexString.fromASCIIString(url)
    });
  }

  public get [Symbol.toStringTag](): string {
    return "TransactionAttribute";
  }

  public serialize(): string {
    const dataInHex = this.data.value();
    if (dataInHex.length > maxTransactionAttributeSize) {
      throw new Error(`Data size too big!`);
    }
    let out = num2hexstring(this.usage);
    out += num2VarInt(dataInHex.length / 2);
    out += dataInHex;
    return out;
  }

  public export(): TransactionAttributeLike {
    return {
      usage: this.usage,
      data: this.data.value()
    };
  }

  public equals(
    other: TransactionAttributeConfig | TransactionAttribute
  ): boolean {
    return (
      this.usage === toTxAttrUsage(other.usage) &&
      this.data.isEqualTo(other.data)
    );
  }
}

export default TransactionAttribute;
