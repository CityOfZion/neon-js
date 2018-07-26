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
/**
 * Adds attributes to the override object for mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object.
 */
function addAttributeForMintToken(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof config.script === "object" &&
            config.script.operation === "mintTokens" &&
            config.script.scriptHash) {
            config.tx.addAttribute(neon_core_1.tx.TxAttrUsage.Script, neon_core_1.u.reverseHex(config.script.scriptHash));
        }
        return config;
    });
}
exports.addAttributeForMintToken = addAttributeForMintToken;
/**
 * Adds the contractState to mintTokens invocations.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object.
 */
function addSignatureForMintToken(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof config.script === "object" &&
            config.script.operation === "mintTokens" &&
            config.script.scriptHash) {
            const verificationSignature = yield common_1.getVerificationSignatureForSmartContract(config.url, config.script.scriptHash);
            if (parseInt(config.script.scriptHash, 16) >
                parseInt(config.account.scriptHash, 16)) {
                config.tx.scripts.push(verificationSignature);
            }
            else {
                config.tx.scripts.unshift(verificationSignature);
            }
        }
        return config;
    });
}
exports.addSignatureForMintToken = addSignatureForMintToken;
//# sourceMappingURL=mint.js.map