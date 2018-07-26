"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../../consts");
const u_1 = require("../../u");
const wallet_1 = require("../../wallet");
class TransactionOutput {
    static deserialize(hex) {
        const ss = new u_1.StringStream(hex);
        return this.fromStream(ss);
    }
    static fromStream(ss) {
        const assetId = u_1.reverseHex(ss.read(32));
        const value = u_1.Fixed8.fromReverseHex(ss.read(8));
        const scriptHash = u_1.reverseHex(ss.read(20));
        return new TransactionOutput({ assetId, value, scriptHash });
    }
    static fromIntent(symbol, value, address) {
        const assetId = consts_1.ASSET_ID[symbol];
        const scriptHash = wallet_1.getScriptHashFromAddress(address);
        return new TransactionOutput({ assetId, value, scriptHash });
    }
    constructor(obj) {
        if (!obj || !obj.assetId || !obj.value || !obj.scriptHash) {
            throw new Error("TransactionOutput requires assetId, value and scriptHash fields");
        }
        this.assetId = obj.assetId;
        this.value = new u_1.Fixed8(obj.value);
        this.scriptHash = obj.scriptHash;
    }
    serialize() {
        return (u_1.reverseHex(this.assetId) +
            this.value.toReverseHex() +
            u_1.reverseHex(this.scriptHash));
    }
    equals(other) {
        return (this.assetId === other.assetId &&
            this.value.equals(other.value) &&
            this.scriptHash === other.scriptHash);
    }
    export() {
        return {
            assetId: this.assetId,
            value: this.value.toNumber(),
            scriptHash: this.scriptHash
        };
    }
}
exports.TransactionOutput = TransactionOutput;
exports.default = TransactionOutput;
//# sourceMappingURL=TransactionOutput.js.map