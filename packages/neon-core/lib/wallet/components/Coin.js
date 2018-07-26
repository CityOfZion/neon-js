"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Fixed8_1 = __importDefault(require("../../u/Fixed8"));
class Coin {
    constructor(coinLike = {}) {
        this.index = coinLike.index || 0;
        this.txid = coinLike.txid || "";
        this.value = new Fixed8_1.default(coinLike.value);
    }
    export() {
        return {
            index: this.index,
            txid: this.txid,
            value: this.value.toNumber()
        };
    }
    equals(other) {
        return (this.index === other.index &&
            this.txid === other.txid &&
            this.value.equals(other.value || 0));
    }
}
exports.Coin = Coin;
exports.default = Coin;
//# sourceMappingURL=Coin.js.map