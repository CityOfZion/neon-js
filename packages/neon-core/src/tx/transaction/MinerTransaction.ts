import { num2hexstring, num2VarInt, StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";

export interface MinerTransactionLike extends TransactionLike {
  nonce: number;
}

export class MinerTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<MinerTransactionLike>
  ): Partial<MinerTransactionLike> {
    const nonce = ss.readUint32();
    return Object.assign(tx, { nonce });
  }

  public nonce: number;

  public readonly type: TransactionType = 0x00;

  constructor(obj: Partial<MinerTransactionLike> = {}) {
    super(obj);

    this.nonce = obj.nonce || 0;
  }

  get exclusiveData() {
    return { nonce: this.nonce };
  }

  get fees(): number {
    return 0;
  }

  public serializeExclusive(): string {
    return num2hexstring(this.nonce, 4, true);
  }

  public export(): MinerTransactionLike {
    return Object.assign(super.export(), {
      nonce: this.nonce
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
