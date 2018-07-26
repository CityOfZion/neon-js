"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../consts");
const helper_1 = require("../helper");
const logging_1 = __importDefault(require("../logging"));
const log = logging_1.default("protocol");
class Protocol {
    constructor(config = {}) {
        this.magic = config.magic || config.Magic || 0;
        this.addressVersion = config.addressVersion || config.AddressVersion || 23;
        this.standbyValidators =
            config.standbyValidators || config.StandbyValidators || [];
        this.seedList = config.seedList || config.SeedList || [];
        this.systemFee = Object.assign({}, config.systemFee || config.SystemFee || consts_1.DEFAULT_SYSFEE);
    }
    get [Symbol.toStringTag]() {
        return "Protocol";
    }
    export() {
        return {
            Magic: this.magic,
            AddressVersion: this.addressVersion,
            StandbyValidators: this.standbyValidators,
            SeedList: this.seedList,
            SystemFee: this.systemFee
        };
    }
    equals(other) {
        return (this.magic === (other.magic || other.Magic) &&
            this.addressVersion === (other.addressVersion || other.AddressVersion) &&
            compareArrays(this.seedList, other.seedList || other.SeedList || []) &&
            compareArrays(this.standbyValidators, other.standbyValidators || other.StandbyValidators || []) &&
            helper_1.compareObject(this.systemFee, other.systemFee || other.SystemFee || {}));
    }
}
exports.Protocol = Protocol;
exports.default = Protocol;
function compareArrays(current, other) {
    if (current.length !== other.length) {
        return false;
    }
    for (let i = 0; i < current.length; i++) {
        if (current[i] !== other[i]) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=Protocol.js.map