import { StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
/**
 * @class Transaction
 * @classdesc
 * Transactions are what you use to interact with the blockchain.
 * A transaction is made up of components found in the component file.
 * Besides those components which are found in every transaction, there are also special data that is unique to each transaction type. These 'exclusive' data can be found in the exclusive file.
 * This class is a wrapper around the various transaction building methods found in this folder.
 */
export declare class Transaction extends BaseTransaction {
    /**
     * Deserializes a hexstring into a Transaction object.
     * @param {string} hexstring - Hexstring of the transaction.
     */
    static deserialize<T extends BaseTransaction>(hex: string): T;
    static deserializeExclusive(ss: StringStream, tx: Partial<TransactionLike>): Partial<TransactionLike>;
    private constructor();
    readonly [Symbol.toStringTag]: string;
    /**
     * Exclusive Data
     */
    readonly exclusiveData: {
        [key: string]: any;
    };
    readonly fees: number;
    serializeExclusive(): string;
}
export default Transaction;
//# sourceMappingURL=Transaction.d.ts.map