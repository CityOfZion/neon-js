import { TX_VERSION } from "../../consts";
import { num2VarInt, StringStream } from "../../u";
import { StateDescriptor, StateDescriptorLike } from "../components";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";

export interface StateTransactionLike extends TransactionLike {
  descriptors: StateDescriptorLike[];
}

/**
 * Transaction used for invoking smart contracts through a VM script.
 * Can also be used to transfer UTXO assets.
 */
export class StateTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<TransactionLike>
  ): Partial<StateTransactionLike> {
    const out = {
      descriptors: [] as StateDescriptor[],
    };
    const descLength = ss.readVarInt();
    for (let i = 0; i < descLength; i++) {
      out.descriptors.push(StateDescriptor.fromStream(ss));
    }
    return Object.assign(tx, out);
  }

  public readonly type: TransactionType = TransactionType.StateTransaction;
  public descriptors: StateDescriptor[];

  public get exclusiveData(): { descriptors: StateDescriptor[] } {
    return { descriptors: this.descriptors };
  }

  public get fees(): number {
    return 0;
  }

  public constructor(obj: Partial<StateTransactionLike> = {}) {
    super(Object.assign({ version: TX_VERSION.STATE }, obj));
    this.descriptors = obj.descriptors
      ? obj.descriptors.map((d) => new StateDescriptor(d))
      : [];
  }

  public serializeExclusive(): string {
    let out = num2VarInt(this.descriptors.length);
    out += this.descriptors.map((d) => d.serialize()).join("");
    return out;
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof StateTransaction) {
      return this.hash === other.hash;
    }
    return this.hash === new StateTransaction(other).hash;
  }

  public export(): StateTransactionLike {
    return Object.assign(super.export(), {
      descriptors: this.descriptors.map((d) => d.export()),
    });
  }
}

export default StateTransaction;
