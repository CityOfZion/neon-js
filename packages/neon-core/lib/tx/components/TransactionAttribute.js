"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const u_1 = require("../../u");
const txAttrUsage_1 = require("../txAttrUsage");
const maxTransactionAttributeSize = 65535;
class TransactionAttribute {
    static deserialize(hex) {
        const ss = new u_1.StringStream(hex);
        return this.fromStream(ss);
    }
    static fromStream(ss) {
        const usage = parseInt(ss.read(1), 16);
        let data;
        if (usage === 0x00 || usage === 0x30 || (usage >= 0xa1 && usage <= 0xaf)) {
            data = ss.read(32);
        }
        else if (usage === 0x02 || usage === 0x03) {
            data = u_1.num2hexstring(usage) + ss.read(32);
        }
        else if (usage === 0x20) {
            data = ss.read(20);
        }
        else if (usage === 0x81) {
            data = ss.read(parseInt(ss.read(1), 16));
        }
        else if (usage === 0x90 || usage >= 0xf0) {
            data = ss.readVarBytes();
        }
        else {
            throw new Error();
        }
        return new TransactionAttribute({ usage, data });
    }
    constructor(obj) {
        if (!obj || obj.usage === undefined || obj.data === undefined) {
            throw new Error("TransactionAttribute requires usage and data fields");
        }
        this.usage = toTxAttrUsage(obj.usage);
        this.data = obj.data;
    }
    get [Symbol.toStringTag]() {
        return "TransactionAttribute";
    }
    serialize() {
        if (this.data.length > maxTransactionAttributeSize) {
            throw new Error();
        }
        let out = u_1.num2hexstring(this.usage);
        if (this.usage === 0x81) {
            out += u_1.num2hexstring(this.data.length / 2);
        }
        else if (this.usage === 0x90 || this.usage >= 0xf0) {
            out += u_1.num2VarInt(this.data.length / 2);
        }
        if (this.usage === 0x02 || this.usage === 0x03) {
            out += this.data.substr(2, 64);
        }
        else {
            out += this.data;
        }
        return out;
    }
    export() {
        return {
            usage: this.usage,
            data: this.data
        };
    }
    equals(other) {
        return (this.usage === toTxAttrUsage(other.usage) && this.data === other.data);
    }
}
exports.TransactionAttribute = TransactionAttribute;
exports.default = TransactionAttribute;
function toTxAttrUsage(type) {
    if (typeof type === "string") {
        if (type in txAttrUsage_1.TxAttrUsage) {
            return txAttrUsage_1.TxAttrUsage[type];
        }
        throw new Error(`${type} not found in TxAttrUsage!`);
    }
    return type;
}
//# sourceMappingURL=TransactionAttribute.js.map