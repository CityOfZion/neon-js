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
const sign_1 = require("./sign");
/**
 * Retrieves RPC endpoint URL of best available node
 * @param config
 * @return Configuration object with url field.
 */
function fillUrl(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.url) {
            return config;
        }
        config.url = yield config.api.getRPCEndpoint(config.net);
        return config;
    });
}
exports.fillUrl = fillUrl;
/**
 * Retrieves Balance if no balance has been attached
 * @param config
 * @return Configuration object.
 */
function fillBalance(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(config.balance instanceof neon_core_1.wallet.Balance)) {
            config.balance = yield config.api.getBalance(config.net, config.account.address);
        }
        return config;
    });
}
exports.fillBalance = fillBalance;
/**
 * Fills the relevant key fields if account has been attached.
 * @param config
 * @return Configuration object.
 */
function fillAccount(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config.account) {
            if (config.privateKey) {
                config.account = new neon_core_1.wallet.Account(config.privateKey);
            }
            else if (config.publicKey) {
                config.account = new neon_core_1.wallet.Account(config.publicKey);
            }
            else if (config.address) {
                config.account = new neon_core_1.wallet.Account(config.address);
            }
            else {
                throw new Error("No identifying key found!");
            }
        }
        return config;
    });
}
exports.fillAccount = fillAccount;
/**
 * Fills the signingFunction if no signingFunction provided.
 * The signingFunction filled is a privateKey signing function using the private key from the account field.
 * Throws an error if unable to find signingFunction and account.
 * @param config
 * @return Configuration object.
 */
function fillSigningFunction(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!config.signingFunction) {
            if (config.account) {
                config.signingFunction = sign_1.signWithPrivateKey(config.account.privateKey);
            }
            else {
                throw new Error("No account found!");
            }
        }
        return config;
    });
}
exports.fillSigningFunction = fillSigningFunction;
/**
 * Retrieves Claims if no claims has been attached.
 * @param config
 * @return Configuration object.
 */
function fillClaims(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(config.claims instanceof neon_core_1.wallet.Claims)) {
            config.claims = yield config.api.getClaims(config.net, config.account.address);
        }
        return config;
    });
}
exports.fillClaims = fillClaims;
//# sourceMappingURL=fill.js.map