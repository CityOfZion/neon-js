"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseTransaction_1 = __importDefault(require("./BaseTransaction"));
class ContractTransaction extends BaseTransaction_1.default {
    constructor(obj = {}) {
        super(obj);
        this.type = 0x80;
    }
    static deserializeExclusive(ss, tx) {
        return {};
    }
    get exclusiveData() {
        return {};
    }
    get fees() {
        return 0;
    }
    serializeExclusive() {
        return "";
    }
    equals(other) {
        if (this.type !== other.type) {
            return false;
        }
        if (other instanceof ContractTransaction) {
            return this.hash === other.hash;
        }
        return this.hash === new ContractTransaction(other).hash;
    }
}
exports.ContractTransaction = ContractTransaction;
exports.default = ContractTransaction;
//# sourceMappingURL=ContractTransaction.js.map