import { Fixed8, StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export interface InvocationTransactionLike extends TransactionLike {
    script: string;
    gas: number | Fixed8;
}
export declare class InvocationTransaction extends BaseTransaction {
    static deserializeExclusive(ss: StringStream, tx: Partial<TransactionLike>): Partial<InvocationTransactionLike>;
    readonly type: TransactionType;
    script: string;
    gas: Fixed8;
    readonly exclusiveData: {
        gas: Fixed8;
        script: string;
    };
    readonly fees: number;
    constructor(obj?: Partial<InvocationTransactionLike>);
    serializeExclusive(): string;
    equals(other: Partial<TransactionLike>): boolean;
    export(): InvocationTransactionLike;
}
export default InvocationTransaction;
//# sourceMappingURL=InvocationTransaction.d.ts.map