"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Fixed8_1 = __importDefault(require("../../u/Fixed8"));
class ClaimItem {
    constructor(claimItemLike = {}) {
        this.claim = new Fixed8_1.default(claimItemLike.claim);
        this.txid = claimItemLike.txid || "";
        this.index = claimItemLike.index || 0;
        this.value = claimItemLike.value || 0;
        this.start = claimItemLike.start;
        this.end = claimItemLike.end;
    }
    export() {
        return {
            claim: this.claim.toNumber(),
            txid: this.txid,
            index: this.index,
            value: this.value,
            start: this.start,
            end: this.end
        };
    }
    equals(other) {
        return (this.claim.equals(other.claim || 0) &&
            this.txid === other.txid &&
            this.index === other.index &&
            this.value === other.value &&
            this.start === other.start &&
            this.end === other.end);
    }
}
exports.ClaimItem = ClaimItem;
exports.default = ClaimItem;
//# sourceMappingURL=ClaimItem.js.map