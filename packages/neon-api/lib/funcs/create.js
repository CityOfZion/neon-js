"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const neon_core_1 = require("@cityofzion/neon-core");
const common_1 = require("./common");
function createClaimTx(config) {
    return __awaiter(this, void 0, void 0, function* () {
        common_1.checkProperty(config, "claims");
        config.tx = new neon_core_1.tx.ClaimTransaction(config.override);
        config.tx.addClaims(config.claims);
        return config;
    });
}
exports.createClaimTx = createClaimTx;
function createContractTx(config) {
    return __awaiter(this, void 0, void 0, function* () {
        common_1.checkProperty(config, "balance", "intents");
        config.tx = new neon_core_1.tx.ContractTransaction(Object.assign({ outputs: config.intents }, config.override));
        config.tx.calculate(config.balance, undefined, config.fees);
        return config;
    });
}
exports.createContractTx = createContractTx;
function createInvocationTx(config) {
    return __awaiter(this, void 0, void 0, function* () {
        common_1.checkProperty(config, "script");
        const processedScript = typeof config.script === "object"
            ? neon_core_1.sc.createScript(config.script)
            : config.script;
        config.tx = new neon_core_1.tx.InvocationTransaction(Object.assign({
            intents: config.intents || [],
            script: processedScript,
            gas: config.gas || 0
        }, config.override));
        config.tx.calculate(config.balance || new neon_core_1.wallet.Balance(), undefined, config.fees);
        return config;
    });
}
exports.createInvocationTx = createInvocationTx;
//# sourceMappingURL=create.js.map