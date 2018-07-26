"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const ClaimItem_1 = __importDefault(require("./components/ClaimItem"));
/**
 * @class Claims
 * @classdesc
 * Claims object used for claiming GAS.
 * @param {Claims} config - Claims-like object
 * @param {string} config.net - Network
 * @param {string}  config.address - The address for this Claims
 * @param {ClaimItem[]} config.claims - The list of claims to be made.
 */
class Claims {
    constructor(config = {}) {
        /** The address for this Claims */
        this.address = config.address || "";
        /** Network which this Claims is using */
        this.net = config.net || "NoNet";
        /** The list of claimable transactions */
        this.claims = config.claims ? config.claims.map(c => new ClaimItem_1.default(c)) : [];
    }
    get [Symbol.toStringTag]() {
        return "Claims";
    }
    [util_1.default.inspect.custom]() {
        const claimsDump = this.claims.map(c => {
            return `${c.txid} <${c.index}>: ${c.claim.toString()}`;
        });
        return `[Claims(${this.net}): ${this.address}]\n${JSON.stringify(claimsDump, null, 2)}`;
    }
    export() {
        return {
            address: this.address,
            net: this.net,
            claims: this.claims.map(c => c.export())
        };
    }
    /**
     * Returns a Claims object that contains part of the total claims starting at start, ending at end.
     */
    slice(start, end) {
        return new Claims({
            address: this.address,
            net: this.net,
            claims: this.claims.slice(start, end)
        });
    }
}
exports.Claims = Claims;
exports.default = Claims;
//# sourceMappingURL=Claims.js.map