"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const u_1 = require("../../u");
class TransactionInput {
    static deserialize(hex) {
        const ss = new u_1.StringStream(hex);
        return this.fromStream(ss);
    }
    static fromStream(ss) {
        const prevHash = u_1.reverseHex(ss.read(32));
        const prevIndex = parseInt(u_1.reverseHex(ss.read(2)), 16);
        return new TransactionInput({ prevHash, prevIndex });
    }
    constructor(obj) {
        if (!obj || obj.prevHash === undefined || obj.prevIndex === undefined) {
            throw new Error("TransactionInput requires prevHash and prevIndex fields");
        }
        this.prevHash = obj.prevHash;
        this.prevIndex = obj.prevIndex;
    }
    serialize() {
        return (u_1.reverseHex(this.prevHash) + u_1.reverseHex(u_1.num2hexstring(this.prevIndex, 2)));
    }
    export() {
        return {
            prevHash: this.prevHash,
            prevIndex: this.prevIndex
        };
    }
    equals(other) {
        return (this.prevHash === other.prevHash && this.prevIndex === other.prevIndex);
    }
}
exports.TransactionInput = TransactionInput;
exports.default = TransactionInput;
//# sourceMappingURL=TransactionInput.js.map