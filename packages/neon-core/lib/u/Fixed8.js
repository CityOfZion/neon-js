"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const misc_1 = require("./misc");
class Fixed8 extends bignumber_js_1.default {
    static fromHex(hex) {
        return new Fixed8(hex, 16).div(100000000);
    }
    static fromReverseHex(hex) {
        return this.fromHex(misc_1.reverseHex(hex));
    }
    constructor(input, base = 10) {
        if (!input) {
            input = "0";
        }
        if (typeof input === "number") {
            input = input.toFixed(8);
        }
        super(input, base);
        Object.setPrototypeOf(this, Fixed8.prototype);
    }
    toHex() {
        const hexstring = this.times(100000000)
            .round(0)
            .toString(16);
        return "0".repeat(16 - hexstring.length) + hexstring;
    }
    toReverseHex() {
        return misc_1.reverseHex(this.toHex());
    }
    /**
     * Returns a Fixed8 whose value is rounded upwards to the next whole number.
     */
    ceil() {
        return new Fixed8(super.decimalPlaces(0, bignumber_js_1.default.ROUND_CEIL));
    }
    /**
     * Returns a Fixed8 whose value is rounded downwards to the previous whole number.
     */
    floor() {
        return new Fixed8(super.decimalPlaces(0, bignumber_js_1.default.ROUND_FLOOR));
    }
    /**
     * Returns true if the value is equivalent.
     */
    equals(other) {
        return super.eq(other);
    }
    /**
     * Returns a Fixed8 rounded to the nearest dp decimal places according to rounding mode rm.
     * If dp is null, round to whole number.
     * If rm is null, round according to default rounding mode.
     * @param dp
     * @param rm
     * @return {Fixed8}
     */
    round(dp = 0, rm) {
        return new Fixed8(super.decimalPlaces(dp, rm));
    }
    /**
     * Returns a Fixed8 whose value is the value of this Fixed8 divided by `n`
     * @alias div
     */
    dividedBy(n, base) {
        return new Fixed8(super.dividedBy(n, base));
    }
    div(n, base) {
        return this.dividedBy(n, base);
    }
    /**
     * Returns a Fixed8 whose value is the value of this Fixed8 multipled by `n`
     * @alias mul
     */
    times(n, base) {
        return new Fixed8(super.times(n, base));
    }
    mul(n, base) {
        return this.times(n, base);
    }
    /**
     * Returns a Fixed8 whose value is the value of this Fixed8 plus `n`
     * @alias add
     */
    plus(n, base) {
        return new Fixed8(super.plus(n, base));
    }
    add(n, base) {
        return this.plus(n, base);
    }
    /**
     * Returns a Fixed8 whose value is the value of this Fixed8 minus `n`
     * @alias sub
     */
    minus(n, base) {
        return new Fixed8(super.minus(n, base));
    }
    sub(n, base) {
        return this.minus(n, base);
    }
}
exports.Fixed8 = Fixed8;
exports.default = Fixed8;
//# sourceMappingURL=Fixed8.js.map