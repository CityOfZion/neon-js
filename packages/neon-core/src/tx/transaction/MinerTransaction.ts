import { TX_VERSION } from "../../consts";
import { num2hexstring, reverseHex, StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export interface MinerTransactionLike extends TransactionLike {
  nonce: number;
}

export interface MinerExclusive {
  nonce: number;
}

export class MinerTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<MinerTransactionLike>
  ): Partial<MinerTransactionLike> {
    // read Uint32 from StringStream
    const nonce = parseInt(reverseHex(ss.read(4)), 16);
    return Object.assign(tx, { nonce });
  }

  public nonce: number;

  public readonly type: TransactionType = 0x00;

  public constructor(obj: Partial<MinerTransactionLike> = {}) {
    super(Object.assign({ version: TX_VERSION.MINER }, obj));
    this.nonce = obj.nonce || 0;
  }

  public get exclusiveData(): MinerExclusive {
    return { nonce: this.nonce };
  }

  public get fees(): number {
    return 0;
  }

  public serializeExclusive(): string {
    return num2hexstring(this.nonce, 4, true);
  }

  public export(): MinerTransactionLike {
    return Object.assign(super.export(), {
      nonce: this.nonce,
    });
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof MinerTransaction) {
      return this.hash === other.hash;
    }
    return this.hash === new MinerTransaction(other).hash;
  }
}

export default MinerTransaction;
