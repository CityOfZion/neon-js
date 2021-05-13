import { ASSET_ID } from "../../consts";
import { Fixed8, reverseHex, StringStream } from "../../u";
import { getScriptHashFromAddress } from "../../wallet";

export interface TransactionOutputLike {
  assetId: string;
  value: number | Fixed8;
  scriptHash: string;
}

/**
 * UTXO that is constructed in this transaction.
 * This represents a spendable coin in the system.
 */
export class TransactionOutput {
  public static deserialize(hex: string): TransactionOutput {
    const ss = new StringStream(hex);
    return this.fromStream(ss);
  }

  public static fromStream(ss: StringStream): TransactionOutput {
    const assetId = reverseHex(ss.read(32));
    const value = Fixed8.fromReverseHex(ss.read(8));
    const scriptHash = reverseHex(ss.read(20));
    return new TransactionOutput({ assetId, value, scriptHash });
  }

  public static fromIntent(
    symbol: string,
    value: number | Fixed8,
    address: string
  ): TransactionOutput {
    const assetId = ASSET_ID[symbol];
    const scriptHash = getScriptHashFromAddress(address);
    return new TransactionOutput({ assetId, value, scriptHash });
  }

  public assetId: string;
  public value: Fixed8;
  public scriptHash: string;

  public constructor(obj: TransactionOutputLike) {
    if (!obj || !obj.assetId || !obj.value || !obj.scriptHash) {
      throw new Error(
        "TransactionOutput requires assetId, value and scriptHash fields"
      );
    }
    this.assetId = obj.assetId;
    this.value = new Fixed8(obj.value);
    this.scriptHash = obj.scriptHash;
  }

  public serialize(): string {
    return (
      reverseHex(this.assetId) +
      this.value.toReverseHex() +
      reverseHex(this.scriptHash)
    );
  }

  public equals(other: TransactionOutputLike): boolean {
    return (
      this.assetId === other.assetId &&
      this.value.equals(other.value) &&
      this.scriptHash === other.scriptHash
    );
  }

  public export(): TransactionOutputLike {
    return {
      assetId: this.assetId,
      value: this.value.toNumber(),
      scriptHash: this.scriptHash,
    };
  }
}

export default TransactionOutput;
