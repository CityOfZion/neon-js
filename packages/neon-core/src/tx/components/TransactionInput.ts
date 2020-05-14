import { num2hexstring, reverseHex, StringStream } from "../../u";

export interface TransactionInputLike {
  prevHash: string;
  prevIndex: number;
}

/**
 * A reference to a TransactionOutput in another confirmed transaction.
 * This is used to denote UTXO that will be spent in this transaction.
 */
export class TransactionInput {
  public static deserialize(hex: string): TransactionInput {
    const ss = new StringStream(hex);
    return this.fromStream(ss);
  }
  public static fromStream(ss: StringStream): TransactionInput {
    const prevHash = reverseHex(ss.read(32));
    const prevIndex = parseInt(reverseHex(ss.read(2)), 16);
    return new TransactionInput({ prevHash, prevIndex });
  }

  public prevHash: string;
  public prevIndex: number;

  public constructor(obj: TransactionInputLike) {
    if (!obj || obj.prevHash === undefined || obj.prevIndex === undefined) {
      throw new Error(
        "TransactionInput requires prevHash and prevIndex fields"
      );
    }
    this.prevHash = obj.prevHash;
    this.prevIndex = obj.prevIndex;
  }

  public serialize(): string {
    return (
      reverseHex(this.prevHash) + reverseHex(num2hexstring(this.prevIndex, 2))
    );
  }

  public export(): TransactionInputLike {
    return {
      prevHash: this.prevHash,
      prevIndex: this.prevIndex,
    };
  }

  public equals(other: TransactionInputLike): boolean {
    return (
      this.prevHash === other.prevHash && this.prevIndex === other.prevIndex
    );
  }
}

export default TransactionInput;
