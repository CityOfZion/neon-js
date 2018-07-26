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
const create_1 = require("./create");
const fill_1 = require("./fill");
const mint_1 = require("./mint");
const send_1 = require("./send");
const sign_1 = require("./sign");
const smartcontract_1 = require("./smartcontract");
const log = neon_core_1.logging.default("api");
/**
 * The core API methods are series of methods defined to aid conducting core functionality while making it easy to modify any parts of it.
 * The core functionality are sendAsset, claimGas and doInvoke.
 * These methods are designed to be modular in nature and intended for developers to create their own custom methods.
 * The methods revolve around a configuration object in which everything is placed. Each method will take in the configuration object, check for its required fields and perform its operations, adding its results to the configuration object and returning it.
 * For example, the getBalanceFrom function requires net and address fields and appends the url and balance fields to the object.
 */
/**
 * Function to construct and execute a ContractTransaction.
 * @param config - Configuration object.
 * @return Configuration object.
 */
function sendAsset(config) {
    return __awaiter(this, void 0, void 0, function* () {
        return fill_1.fillAccount(config)
            .then(fill_1.fillSigningFunction)
            .then(fill_1.fillUrl)
            .then(fill_1.fillBalance)
            .then(create_1.createContractTx)
            .then(smartcontract_1.addAttributeIfExecutingAsSmartContract)
            .then(sign_1.signTx)
            .then(smartcontract_1.addSignatureIfExecutingAsSmartContract)
            .then(send_1.sendTx)
            .then(send_1.applyTxToBalance)
            .catch((err) => {
            const dump = common_1.extractDump(config);
            log.error(`sendAsset failed with: ${err.message}. Dumping config`, dump);
            throw err;
        });
    });
}
exports.sendAsset = sendAsset;
/**
 * Perform a ClaimTransaction for all available GAS based on API
 * @param config - Configuration object.
 * @return Configuration object.
 */
function claimGas(config) {
    return __awaiter(this, void 0, void 0, function* () {
        return fill_1.fillAccount(config)
            .then(fill_1.fillSigningFunction)
            .then(fill_1.fillUrl)
            .then(fill_1.fillClaims)
            .then(create_1.createClaimTx)
            .then(smartcontract_1.addAttributeIfExecutingAsSmartContract)
            .then(sign_1.signTx)
            .then(smartcontract_1.addSignatureIfExecutingAsSmartContract)
            .then(send_1.sendTx)
            .catch((err) => {
            const dump = common_1.extractDump(config);
            log.error(`claimGas failed with: ${err.message}. Dumping config`, dump);
            throw err;
        });
    });
}
exports.claimGas = claimGas;
/**
 * Perform a InvocationTransaction based on config given.
 * @param config - Configuration object.
 * @return Configuration object.
 */
function doInvoke(config) {
    return __awaiter(this, void 0, void 0, function* () {
        return fill_1.fillAccount(config)
            .then(fill_1.fillSigningFunction)
            .then(fill_1.fillUrl)
            .then(fill_1.fillBalance)
            .then(create_1.createInvocationTx)
            .then(smartcontract_1.addAttributeIfExecutingAsSmartContract)
            .then(mint_1.addAttributeForMintToken)
            .then(common_1.modifyTransactionForEmptyTransaction)
            .then(sign_1.signTx)
            .then(smartcontract_1.addSignatureIfExecutingAsSmartContract)
            .then(mint_1.addSignatureForMintToken)
            .then(send_1.sendTx)
            .then(send_1.applyTxToBalance)
            .catch((err) => {
            const dump = common_1.extractDump(config);
            log.error(`claimGas failed with: ${err.message}. Dumping config`, dump);
            throw err;
        });
    });
}
exports.doInvoke = doInvoke;
function makeIntent(assetAmts, address) {
    const acct = new neon_core_1.wallet.Account(address);
    return Object.keys(assetAmts).map(key => {
        return new neon_core_1.tx.TransactionOutput({
            assetId: neon_core_1.CONST.ASSET_ID[key],
            value: assetAmts[key],
            scriptHash: acct.scriptHash
        });
    });
}
exports.makeIntent = makeIntent;
//# sourceMappingURL=main.js.map