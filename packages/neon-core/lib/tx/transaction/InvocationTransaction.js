"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../../consts");
const u_1 = require("../../u");
const BaseTransaction_1 = require("./BaseTransaction");
class InvocationTransaction extends BaseTransaction_1.BaseTransaction {
    constructor(obj = {}) {
        super(Object.assign({ version: consts_1.TX_VERSION.INVOCATION }, obj));
        this.type = 0xd1;
        this.script = obj.script || "";
        this.gas = new u_1.Fixed8(obj.gas);
    }
    static deserializeExclusive(ss, tx) {
        const script = ss.readVarBytes();
        const version = parseInt(ss.str.substr(2, 2), 16);
        const gas = version >= 1 ? u_1.fixed82num(ss.read(8)) : 0;
        return Object.assign(tx, { script, gas });
    }
    get exclusiveData() {
        return { gas: this.gas, script: this.script };
    }
    get fees() {
        return this.gas.toNumber();
    }
    serializeExclusive() {
        let out = u_1.num2VarInt(this.script.length / 2);
        out += this.script;
        if (this.version >= 1) {
            out += this.gas.toReverseHex();
        }
        return out;
    }
    equals(other) {
        if (this.type !== other.type) {
            return false;
        }
        if (other instanceof InvocationTransaction) {
            return this.hash === other.hash;
        }
        return this.hash === new InvocationTransaction(other).hash;
    }
    export() {
        return Object.assign(super.export(), {
            script: this.script,
            gas: this.gas.toNumber()
        });
    }
}
exports.InvocationTransaction = InvocationTransaction;
exports.default = InvocationTransaction;
//# sourceMappingURL=InvocationTransaction.js.map