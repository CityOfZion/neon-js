"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../../helper");
const Fixed8_1 = __importDefault(require("../../u/Fixed8"));
const Coin_1 = __importDefault(require("./Coin"));
class AssetBalance {
    constructor(abLike = {}) {
        this.unspent = abLike.unspent
            ? abLike.unspent.map(coin => new Coin_1.default(coin))
            : [];
        this.spent = abLike.spent ? abLike.spent.map(coin => new Coin_1.default(coin)) : [];
        this.unconfirmed = abLike.unconfirmed
            ? abLike.unconfirmed.map(coin => new Coin_1.default(coin))
            : [];
    }
    get balance() {
        return this.unspent.reduce((p, c) => p.add(c.value), new Fixed8_1.default(0));
    }
    export() {
        return {
            balance: this.balance.toNumber(),
            unspent: this.unspent.map(c => c.export()),
            spent: this.spent.map(c => c.export()),
            unconfirmed: this.unconfirmed.map(c => c.export())
        };
    }
    equals(other) {
        return (helper_1.compareNeonObjectArray(this.unspent, other.unspent) &&
            helper_1.compareNeonObjectArray(this.spent, other.spent) &&
            helper_1.compareNeonObjectArray(this.unconfirmed, other.unconfirmed));
    }
}
exports.AssetBalance = AssetBalance;
exports.default = AssetBalance;
//# sourceMappingURL=AssetBalance.js.map