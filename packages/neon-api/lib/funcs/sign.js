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
 * Signs a transaction within the config object.
 * @param config - Configuration object.
 * @return Configuration object.
 */
function signTx(config) {
    return __awaiter(this, void 0, void 0, function* () {
        common_1.checkProperty(config, "signingFunction", "tx");
        const signatures = yield config.signingFunction(config.tx.serialize(false), config.account.publicKey);
        if (signatures instanceof Array) {
            signatures.forEach(sig => {
                addSignature(config.tx, sig);
            });
        }
        else {
            addSignature(config.tx, signatures);
        }
        return config;
    });
}
exports.signTx = signTx;
function addSignature(transaction, signature) {
    transaction.scripts.push(neon_core_1.tx.Witness.deserialize(signature));
}
function signWithPrivateKey(privateKey) {
    const pubKey = new neon_core_1.wallet.Account(privateKey).publicKey;
    return (txString, publicKey) => __awaiter(this, void 0, void 0, function* () {
        const sig = neon_core_1.wallet.sign(txString, privateKey);
        const witness = neon_core_1.tx.Witness.fromSignature(sig, publicKey || pubKey);
        return witness.serialize();
    });
}
exports.signWithPrivateKey = signWithPrivateKey;
//# sourceMappingURL=sign.js.map