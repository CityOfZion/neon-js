import { StringStream } from "../../u";
import BaseTransaction, { TransactionLike } from "./BaseTransaction";

export class ContractTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<TransactionLike>
  ): Partial<TransactionLike> {
    return {};
  }

  public readonly type: number = 0x80;

  get exclusiveData() {
    return {};
  }

  get fees(): number {
    return 0;
  }

  constructor(obj: Partial<TransactionLike> = {}) {
    super(obj);
  }

  public serializeExclusive(): string {
    return "";
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof ContractTransaction) {
      return this.hash === other.hash;
    }

    return this.hash === new ContractTransaction(other).hash;
  }
}

export default ContractTransaction;
