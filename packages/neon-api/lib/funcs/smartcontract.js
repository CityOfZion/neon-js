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
 * @param config - Configuration object.
 * @return Configuration object.
 */
function addAttributeIfExecutingAsSmartContract(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config.sendingFromSmartContract) {
            return config;
        }
        config.tx.addAttribute(neon_core_1.tx.TxAttrUsage.Script, neon_core_1.u.reverseHex(config.sendingFromSmartContract));
        return config;
    });
}
exports.addAttributeIfExecutingAsSmartContract = addAttributeIfExecutingAsSmartContract;
/**
 * Adds the contractState to invocations sending from the contract's balance.
 * @param config - Configuration object.
 * @return Configuration object.
 */
function addSignatureIfExecutingAsSmartContract(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config.sendingFromSmartContract) {
            return config;
        }
        const verificationSignature = yield common_1.getVerificationSignatureForSmartContract(config.url, config.sendingFromSmartContract);
        // We need to order this for the VM.
        const acct = config.account;
        if (parseInt(config.sendingFromSmartContract, 16) >
            parseInt(acct.scriptHash, 16)) {
            config.tx.scripts.push(verificationSignature);
        }
        else {
            config.tx.scripts.unshift(verificationSignature);
        }
        return config;
    });
}
exports.addSignatureIfExecutingAsSmartContract = addSignatureIfExecutingAsSmartContract;
//# sourceMappingURL=smartcontract.js.map