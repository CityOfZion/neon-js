"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["MinerTransaction"] = 0] = "MinerTransaction";
    TransactionType[TransactionType["IssueTransaction"] = 1] = "IssueTransaction";
    TransactionType[TransactionType["ClaimTransaction"] = 2] = "ClaimTransaction";
    TransactionType[TransactionType["EnrollmentTransaction"] = 32] = "EnrollmentTransaction";
    TransactionType[TransactionType["RegisterTransaction"] = 64] = "RegisterTransaction";
    TransactionType[TransactionType["ContractTransaction"] = 128] = "ContractTransaction";
    TransactionType[TransactionType["StateTransaction"] = 144] = "StateTransaction";
    TransactionType[TransactionType["PublishTransaction"] = 208] = "PublishTransaction";
    TransactionType[TransactionType["InvocationTransaction"] = 209] = "InvocationTransaction";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
exports.default = TransactionType;
//# sourceMappingURL=TransactionType.js.map