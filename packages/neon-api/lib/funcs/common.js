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
/**
 * Check that properties are defined in obj.
 * @param obj - Object to check.
 * @param props - List of properties to check.
 */
function checkProperty(obj, ...props) {
    for (const prop of props) {
        if (!obj.hasOwnProperty(prop) ||
            obj[prop] === null ||
            obj[prop] === undefined) {
            throw new ReferenceError(`Property not found: ${prop}`);
        }
    }
}
exports.checkProperty = checkProperty;
/**
 * Adds the necessary attributes for validating an empty transaction.
 * @param config
 * @return
 */
function modifyTransactionForEmptyTransaction(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.tx.inputs.length === 0 && config.tx.outputs.length === 0) {
            config.tx.addAttribute(neon_core_1.tx.TxAttrUsage.Script, neon_core_1.u.reverseHex(neon_core_1.wallet.getScriptHashFromAddress(config.account.address)));
            // This adds some random bits to the transaction to prevent any hash collision.
            config.tx.addRemark(Date.now().toString() + neon_core_1.u.ab2hexstring(neon_core_1.u.generateRandomArray(4)));
        }
        return config;
    });
}
exports.modifyTransactionForEmptyTransaction = modifyTransactionForEmptyTransaction;
const sensitiveFields = ["privateKey"];
/**
 * Extracts fields for logging purposes. Removes any sensitive fields.
 * @param config Configuration object
 * @return object safe for logging
 */
function extractDump(config) {
    const dump = Object.assign({}, config);
    for (const key of Object.keys(config)) {
        if (sensitiveFields.indexOf(key) >= 0) {
            delete dump[key];
        }
    }
    return dump;
}
exports.extractDump = extractDump;
/**
 * Returns a signature that can trigger verification for smart contract.
 * Must be combined with a Script attribute for full effect.
 * This signature requires some ordering within the array.
 * @param url RPC url
 * @param smartContractScriptHash The scripthash of the smart contract that you want to trigger verification for.
 * @return A signature object that can be attached to a Transaction.
 */
function getVerificationSignatureForSmartContract(url, smartContractScriptHash) {
    return __awaiter(this, void 0, void 0, function* () {
        const contractState = yield neon_core_1.rpc.Query.getContractState(smartContractScriptHash).execute(url);
        const { parameters } = contractState.result;
        return {
            invocationScript: "00".repeat(parameters.length),
            verificationScript: ""
        };
    });
}
exports.getVerificationSignatureForSmartContract = getVerificationSignatureForSmartContract;
//# sourceMappingURL=common.js.map