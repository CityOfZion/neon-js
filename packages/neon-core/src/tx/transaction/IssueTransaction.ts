import { TX_VERSION } from "../../consts";
import { ASSET_ID, DEFAULT_SYSFEE } from "../../consts";
import { StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";

export class IssueTransaction extends BaseTransaction {
  public static deserializeExclusive(
    _ss: StringStream,
    _tx: Partial<TransactionLike>
  ): Partial<TransactionLike> {
    return {};
  }

  public readonly type: TransactionType = TransactionType.IssueTransaction;

  public constructor(obj: Partial<TransactionLike> = {}) {
    super(Object.assign({ version: TX_VERSION.ISSUE }, obj));
  }
  public get exclusiveData(): Record<string, unknown> {
    return {};
  }
  public get fees(): number {
    if (this.version >= 1) {
      return 0;
    }
    if (
      this.outputs.every(
        (p) => p.assetId === ASSET_ID.NEO || p.assetId === ASSET_ID.GAS
      )
    ) {
      return 0;
    }
    return DEFAULT_SYSFEE.issueTransaction;
  }

  public serializeExclusive(): string {
    return "";
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof IssueTransaction) {
      return this.hash === other.hash;
    }
    return this.hash === new IssueTransaction(other).hash;
  }
}

export default IssueTransaction;
