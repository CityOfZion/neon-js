import { StringStream } from "../../u";
import { Claims } from "../../wallet";
import { TransactionInput, TransactionInputLike } from "../components";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";
export interface ClaimTransactionLike extends TransactionLike {
    claims: TransactionInputLike[];
}
export interface ClaimExclusive {
    claims: TransactionInput[];
}
export declare class ClaimTransaction extends BaseTransaction {
    static deserializeExclusive(ss: StringStream, tx: Partial<TransactionLike>): Partial<ClaimTransactionLike>;
    static fromClaims(claim: Claims): ClaimTransaction;
    readonly type: TransactionType;
    claims: TransactionInput[];
    readonly exclusiveData: ClaimExclusive;
    readonly fees: number;
    constructor(obj?: Partial<ClaimTransactionLike>);
    addClaims(claim: Claims): this;
    serializeExclusive(): string;
    equals(other: Partial<TransactionLike>): boolean;
    export(): ClaimTransactionLike;
}
export default ClaimTransaction;
//# sourceMappingURL=ClaimTransaction.d.ts.map