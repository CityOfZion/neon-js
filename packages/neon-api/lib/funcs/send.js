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
const log = neon_core_1.logging.default("api");
/**
 * Sends a transaction off within the config object.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object + response
 */
function sendTx(config) {
    return __awaiter(this, void 0, void 0, function* () {
        common_1.checkProperty(config, "tx", "url");
        const response = yield neon_core_1.rpc.Query.sendRawTransaction(config.tx).execute(config.url);
        if (response.result === true) {
            response.txid = config.tx.hash;
        }
        else {
            log.error(`Transaction failed for ${config.address}: ${config.tx.serialize()}`);
        }
        return Object.assign(config, { response });
    });
}
exports.sendTx = sendTx;
function applyTxToBalance(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.response && config.response.result && config.balance) {
            config.balance.applyTx(config.tx, false);
        }
        return config;
    });
}
exports.applyTxToBalance = applyTxToBalance;
//# sourceMappingURL=send.js.map