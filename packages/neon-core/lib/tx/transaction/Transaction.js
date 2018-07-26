"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const u_1 = require("../../u");
const BaseTransaction_1 = require("./BaseTransaction");
const ClaimTransaction_1 = require("./ClaimTransaction");
const ContractTransaction_1 = require("./ContractTransaction");
const InvocationTransaction_1 = require("./InvocationTransaction");
const main_1 = require("./main");
/**
 * @class Transaction
 * @classdesc
 * Transactions are what you use to interact with the blockchain.
 * A transaction is made up of components found in the component file.
 * Besides those components which are found in every transaction, there are also special data that is unique to each transaction type. These 'exclusive' data can be found in the exclusive file.
 * This class is a wrapper around the various transaction building methods found in this folder.
 */
class Transaction extends BaseTransaction_1.BaseTransaction {
    /**
     * Deserializes a hexstring into a Transaction object.
     * @param {string} hexstring - Hexstring of the transaction.
     */
    static deserialize(hex) {
        const ss = new u_1.StringStream(hex);
        let txObj = main_1.deserializeType(ss);
        const txClass = getType(txObj.type);
        txObj = main_1.deserializeVersion(ss, txObj);
        txObj = txClass.deserializeExclusive(ss, txObj);
        txObj = main_1.deserializeAttributes(ss, txObj);
        txObj = main_1.deserializeInputs(ss, txObj);
        txObj = main_1.deserializeOutputs(ss, txObj);
        txObj = main_1.deserializeWitnesses(ss, txObj);
        return new txClass(txObj);
    }
    static deserializeExclusive(ss, tx) {
        throw new Error("Method not implemented.");
    }
    constructor(tx = {}) {
        super(tx);
    }
    get [Symbol.toStringTag]() {
        return "Transaction";
    }
    /**
     * Exclusive Data
     */
    get exclusiveData() {
        throw new Error("Not Implemented!");
    }
    get fees() {
        return 0;
    }
    serializeExclusive() {
        throw new Error("Method not implemented.");
    }
}
exports.Transaction = Transaction;
exports.default = Transaction;
function getType(type) {
    switch (type) {
        case 0x02:
            return ClaimTransaction_1.ClaimTransaction;
        case 0x80:
            return ContractTransaction_1.ContractTransaction;
        case 0xd1:
            return InvocationTransaction_1.InvocationTransaction;
        default:
            throw new Error("Unknown TransactionType");
    }
}
//# sourceMappingURL=Transaction.js.map