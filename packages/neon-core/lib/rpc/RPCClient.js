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
const consts_1 = require("../consts");
const logging_1 = __importDefault(require("../logging"));
const settings_1 = require("../settings");
const wallet_1 = require("../wallet");
const Query_1 = __importDefault(require("./Query"));
const log = logging_1.default("rpc");
const versionRegex = /NEO:(\d+\.\d+\.\d+)/;
/**
 * @class RPCClient
 * @classdesc
 * RPC Client model to query a NEO node. Contains built-in methods to query using RPC calls.
 * @param {string} net - 'MainNet' or 'TestNet' will query the default RPC address found in consts. You may provide a custom URL.
 * @param {string} version - Version of NEO node. Used to check if RPC methods have been implemented. it will default to DEFAULT_RPC found in CONST
 */
class RPCClient {
    constructor(net, version = consts_1.RPC_VERSION) {
        if (net === consts_1.NEO_NETWORK.MAIN) {
            this.net = consts_1.DEFAULT_RPC.MAIN;
        }
        else if (net === consts_1.NEO_NETWORK.TEST) {
            this.net = consts_1.DEFAULT_RPC.TEST;
        }
        else {
            this.net = net;
        }
        this.history = [];
        this.lastSeenHeight = 0;
        this._latencies = [];
        this.version = version;
    }
    get [Symbol.toStringTag]() {
        return "RPC Client";
    }
    get latency() {
        if (this._latencies.length === 0) {
            return 99999;
        }
        return Math.floor(this._latencies.reduce((p, c) => p + c, 0) / this._latencies.length);
    }
    set latency(lat) {
        if (this._latencies.length > 4) {
            this._latencies.shift();
        }
        this._latencies.push(lat);
    }
    /**
     * Measures the latency using getBlockCount call. Returns the current latency. For average, call this.latency
     */
    ping() {
        return __awaiter(this, void 0, void 0, function* () {
            const timeStart = Date.now();
            const query = Query_1.default.getBlockCount();
            try {
                const response = yield this.execute(query, { timeout: settings_1.timeout.ping });
                this.lastSeenHeight = response.result;
                const newPing = Date.now() - timeStart;
                this.latency = newPing;
                return newPing;
            }
            catch (err) {
                this.latency = settings_1.timeout.ping;
                return settings_1.timeout.ping;
            }
        });
    }
    /**
     * Takes an Query object and executes it. Adds the Query object to history.
     */
    execute(query, config) {
        this.history.push(query);
        log.info(`RPC: ${this.net} executing Query[${query.req.method}]`);
        return query.execute(this.net, config);
    }
    /**
     * Creates a query with the given req and immediately executes it.
     */
    query(req, config) {
        const query = new Query_1.default(req);
        return this.execute(query, config);
    }
    /**
     * Gets the state of an account given an address.
     */
    getAccountState(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!wallet_1.isAddress(addr)) {
                throw new Error(`Invalid address given: ${addr}`);
            }
            const response = yield this.execute(Query_1.default.getAccountState(addr));
            return response.result;
        });
    }
    /**
     * Gets the state of an asset given an id.
     */
    getAssetState(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getAssetState(assetId));
            return response.result;
        });
    }
    /**
     * Gets the block at a given height or hash.
     */
    getBlock(indexOrHash, verbose = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getBlock(indexOrHash, verbose));
            return response.result;
        });
    }
    /**
     * Gets the block hash at a given height.
     */
    getBlockHash(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getBlockHash(index));
            return response.result;
        });
    }
    /**
     * Get the latest block hash.
     */
    getBestBlockHash() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getBestBlockHash());
            return response.result;
        });
    }
    /**
     * Get the current block height.
     */
    getBlockCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getBlockCount());
            return response.result;
        });
    }
    /**
     * Get the system fees of a block.
     * @param {number} index
     * @return {Promise<string>} - System fees as a string.
     */
    getBlockSysFee(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getBlockSysFee(index));
            return response.result;
        });
    }
    /**
     * Gets the number of peers this node is connected to.
     * @return {Promise<number>}
     */
    getConnectionCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getConnectionCount());
            return response.result;
        });
    }
    /**
     * Gets the state of the contract at the given scriptHash.
     */
    getContractState(scriptHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getContractState(scriptHash));
            return response.result;
        });
    }
    /**
     * Gets a list of all peers that this node has discovered.
     */
    getPeers() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getPeers());
            return response.result;
        });
    }
    /**
     * Gets a list of all transaction hashes waiting to be processed.
     */
    getRawMemPool() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getRawMemPool());
            return response.result;
        });
    }
    /**
     * Gets a transaction based on its hash.
     */
    getRawTransaction(txid, verbose = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getRawTransaction(txid, verbose));
            return response.result;
        });
    }
    /**
     * Gets the corresponding value of a key in the storage of a contract address.
     */
    getStorage(scriptHash, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getStorage(scriptHash, key));
            return response.result;
        });
    }
    /**
     * Gets the transaction output given a transaction id and index
     */
    getTxOut(txid, index) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.getTxOut(txid, index));
            return response.result;
        });
    }
    /**
     * Gets the version of the NEO node. This method will never be blocked by version. This method will also update the current Client's version to the one received.
     */
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.execute(Query_1.default.getVersion());
                const newVersion = response.result.useragent.match(versionRegex)[1];
                this.version = newVersion;
                return this.version;
            }
            catch (err) {
                if (err.message.includes("Method not found")) {
                    this.version = consts_1.RPC_VERSION;
                    return this.version;
                }
                else {
                    throw err;
                }
            }
        });
    }
    /**
     * Calls a smart contract with the given parameters. This method is a local invoke, results are not reflected on the blockchain.
     */
    invoke(scriptHash, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.invoke(scriptHash, ...params));
            return response.result;
        });
    }
    /**
     * Submits a contract method call with parameters for the node to run. This method is a local invoke, results are not reflected on the blockchain.
     */
    invokeFunction(scriptHash, operation, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.invokeFunction(scriptHash, operation, ...params));
            return response.result;
        });
    }
    /**
     * Submits a script for the node to run. This method is a local invoke, results are not reflected on the blockchain.
     */
    invokeScript(script) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.invokeScript(script));
            return response.result;
        });
    }
    /**
     * Sends a serialized transaction to the network.
     */
    sendRawTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.sendRawTransaction(transaction));
            return response.result;
        });
    }
    /**
     * Submits a serialized block to the network.
     */
    submitBlock(block) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.submitBlock(block));
            return response.result;
        });
    }
    /**
     * Checks if the provided address is a valid NEO address.
     */
    validateAddress(addr) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.execute(Query_1.default.validateAddress(addr));
            return response.result.isvalid;
        });
    }
}
exports.RPCClient = RPCClient;
exports.default = RPCClient;
//# sourceMappingURL=RPCClient.js.map