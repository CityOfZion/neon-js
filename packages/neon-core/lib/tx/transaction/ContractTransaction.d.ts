import { StringStream } from "../../u";
import BaseTransaction, { TransactionLike } from "./BaseTransaction";
export declare class ContractTransaction extends BaseTransaction {
    static deserializeExclusive(ss: StringStream, tx: Partial<TransactionLike>): Partial<TransactionLike>;
    readonly type: number;
    readonly exclusiveData: {};
    readonly fees: number;
    constructor(obj?: Partial<TransactionLike>);
    serializeExclusive(): string;
    equals(other: Partial<TransactionLike>): boolean;
}
export default ContractTransaction;
//# sourceMappingURL=ContractTransaction.d.ts.map