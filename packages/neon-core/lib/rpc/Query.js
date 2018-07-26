"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const consts_1 = require("../consts");
const helper_1 = require("../helper");
const logging_1 = __importDefault(require("../logging"));
const settings_1 = require("../settings");
const BaseTransaction_1 = require("../tx/transaction/BaseTransaction");
const log = logging_1.default("rpc");
/**
 * @class Query
 * @classdesc
 * A Query object helps us to construct and record requests
 * @param req
 */
class Query {
    /**
     * @param addr address in Base58 encoding (starting with A)
     */
    static getAccountState(addr) {
        return new Query({
            method: "getaccountstate",
            params: [addr]
        });
    }
    /**
     * @param assetId
     */
    static getAssetState(assetId) {
        return new Query({
            method: "getassetstate",
            params: [assetId]
        });
    }
    /**
     * This Query returns the specified block either as a hexstring or human readable JSON.
     * @param indexOrHash height or hash of block.
     * @param verbose 0 for hexstring, 1 for JSON. Defaults to 1.
     */
    static getBlock(indexOrHash, verbose = 1) {
        return new Query({
            method: "getblock",
            params: [indexOrHash, verbose]
        });
    }
    /**
     * This Query returns the hash of a specific block.
     * @param {number} index height of block.
     */
    static getBlockHash(index) {
        return new Query({
            method: "getblockhash",
            params: [index]
        });
    }
    /**
     * This Query returns the hash of the highest block.
     */
    static getBestBlockHash() {
        return new Query({
            method: "getbestblockhash"
        });
    }
    /**
     * This Query returns the current block height.
     */
    static getBlockCount() {
        return new Query({
            method: "getblockcount"
        });
    }
    /**
     * This Query returns the amount of GAS burnt as fees within a specific block.
     * @param index height of block.
     */
    static getBlockSysFee(index) {
        return new Query({
            method: "getblocksysfee",
            params: [index]
        });
    }
    /**
     * This Query returns the number of other nodes that this node is connected to.
     */
    static getConnectionCount() {
        return new Query({
            method: "getconnectioncount"
        });
    }
    /**
     * This Query returns information about the smart contract registered at the specific hash.
     * @param scriptHash hash of contract
     */
    static getContractState(scriptHash) {
        return new Query({
            method: "getcontractstate",
            params: [scriptHash]
        });
    }
    /**
     * This Query returns the list of nodes that this node is connected to.
     */
    static getPeers() {
        return new Query({
            method: "getpeers"
        });
    }
    /**
     * This Query returns the transaction hashes of the transactions waiting to be processed at the node.
     */
    static getRawMemPool() {
        return new Query({
            method: "getrawmempool"
        });
    }
    /**
     * This Query returns information about a specific transaction in either hexstring or human readable JSON.
     * @param txid hash of the specific transaction.
     * @param verbose 0 for hexstring, 1 for JSON. Defaults to 1.
     */
    static getRawTransaction(txid, verbose = 1) {
        return new Query({
            method: "getrawtransaction",
            params: [txid, verbose]
        });
    }
    /**
     * This Query returns the raw value stored at the specific key under a specific contract.
     * @param scriptHash hash of contract.
     * @param key
     */
    static getStorage(scriptHash, key) {
        return new Query({
            method: "getstorage",
            params: [scriptHash, key]
        });
    }
    /**
     * This Query returns the status of a TransactionOutput. If the output has been spent, this will return null.
     * @param txid hash of transaction.
     * @param index position of output in the vout array.
     */
    static getTxOut(txid, index) {
        return new Query({
            method: "gettxout",
            params: [txid, index]
        });
    }
    /**
     * This Query returns the node version.
     */
    static getVersion() {
        return new Query({
            method: "getversion"
        });
    }
    /**
     * This Query invokes the VM to run the given contract with the given parameters.
     * @param scriptHash hash of contract to test.
     * @param params parameters to pass into the VM.
     */
    static invoke(scriptHash, ...params) {
        return new Query({
            method: "invoke",
            params: [scriptHash, params]
        });
    }
    /**
     * This Query invokes the VM to run the specific contract with the provided operation and params. Do note that this function only suits contracts with a Main(string, args[]) entry method.
     * @param scriptHash hash of contract to test.
     * @param operation name of operation to call (first argument)
     * @param params parameters to pass (second argument)
     */
    static invokeFunction(scriptHash, operation, ...params) {
        return new Query({
            method: "invokefunction",
            params: [scriptHash, operation, params]
        });
    }
    /**
     * This Query runs the specific script through the VM.
     * @param script
     */
    static invokeScript(script) {
        return new Query({
            method: "invokescript",
            params: [script]
        });
    }
    /**
     * This Query transmits the specific transaction to the node.
     * @param transaction Transaction as a Transaction object or hexstring.
     */
    static sendRawTransaction(transaction) {
        const serialized = transaction instanceof BaseTransaction_1.BaseTransaction
            ? transaction.serialize(true)
            : transaction;
        return new Query({
            method: "sendrawtransaction",
            params: [serialized]
        });
    }
    /**
     * This Query submits a block for processing.
     * @param block
     */
    static submitBlock(block) {
        return new Query({
            method: "submitblock",
            params: [block]
        });
    }
    /**
     * This Query submits an address for validation.
     * @param addr Address to validate.
     */
    static validateAddress(addr) {
        return new Query({
            method: "validateaddress",
            params: [addr]
        });
    }
    get id() {
        return this.req.id;
    }
    get method() {
        return this.req.method;
    }
    get params() {
        return this.req.params;
    }
    constructor(req) {
        this.req = Object.assign({}, consts_1.DEFAULT_REQ, req);
        this.completed = false;
    }
    get [Symbol.toStringTag]() {
        return "Query";
    }
    /**
     * Attaches a parser method to the Query. This method will be used to parse the response.
     */
    parseWith(parser) {
        this.parse = parser;
        return this;
    }
    /**
     * Executes the Query by sending the RPC request to the provided net.
     * @param url The URL of the node.
     * @param config Request configuration
     */
    execute(url, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.completed) {
                throw new Error("This request has been sent");
            }
            const response = yield queryRPC(url, this.req, config);
            this.res = response;
            this.completed = true;
            if (response.error) {
                throw new Error(response.error.message);
            }
            if (this.parse) {
                log.info(`Query[${this.req.method}] successful`);
                return this.parse(response.result);
            }
            return response;
        });
    }
    export() {
        return Object.assign({}, this.req, {
            params: this.req.params.map(p => {
                if (typeof p === "object") {
                    return JSON.parse(JSON.stringify(p));
                }
                return p;
            })
        });
    }
    equals(other) {
        return (this.req.id === other.id &&
            this.req.method === other.method &&
            helper_1.compareArray(this.req.params, other.params || []));
    }
}
exports.Query = Query;
exports.default = Query;
/**
 * Wrapper for querying node RPC
 * @param url Node URL.
 * @param req RPC Request object.
 * @param config Configuration to pass down to axios
 * @returns RPC Response
 */
function queryRPC(url, req, config = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = Object.assign({}, consts_1.DEFAULT_REQ, req);
        const conf = Object.assign({
            headers: { "Content-Type": "application/json" },
            timeout: settings_1.timeout.rpc
        }, config);
        const response = yield axios_1.default.post(url, body, conf);
        return response.data;
    });
}
exports.queryRPC = queryRPC;
//# sourceMappingURL=Query.js.map