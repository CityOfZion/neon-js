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
const neon_core_1 = require("@cityofzion/neon-core");
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("./helper");
const log = neon_core_1.logging.default("api");
exports.name = "neonDB";
const rpcCache = new helper_1.RpcCache();
/**
 * Returns the appropriate neonDB endpoint.
 * @param net Name of network to retrieve the endpoint from. Alternatively, provide a custom url.
 * @return URL of API endpoint.
 */
function getAPIEndpoint(net) {
    if (neon_core_1.settings.networks[net]) {
        return neon_core_1.settings.networks[net].extra.neonDB;
    }
    return net;
}
exports.getAPIEndpoint = getAPIEndpoint;
/**
 * Returns an appropriate RPC endpoint retrieved from a neonDB endpoint.
 * @param net 'MainNet', 'TestNet' or a custom neonDB-like url.
 * @returns URL of a good RPC endpoint.
 */
function getRPCEndpoint(net) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v2/network/nodes");
        const data = response.data;
        let nodes = data
            .filter(d => d.status)
            .map(d => ({ height: d.block_height, url: d.url }));
        if (neon_core_1.settings.httpsOnly) {
            nodes = helper_1.filterHttpsOnly(nodes);
        }
        const goodNodes = helper_1.findGoodNodesFromHeight(nodes);
        if (goodNodes.length === 0) {
            throw new Error("No eligible nodes found!");
        }
        const urls = goodNodes.map(n => n.url);
        const bestRPC = rpcCache.findBestRPC(urls);
        return bestRPC;
    });
}
exports.getRPCEndpoint = getRPCEndpoint;
/**
 * Get balances of NEO and GAS for an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Balance>} Balance of address
 */
function getBalance(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v2/address/balance/" + address);
        const data = response.data;
        const bal = new neon_core_1.wallet.Balance({ net, address });
        bal.addAsset("NEO", data.NEO);
        bal.addAsset("GAS", data.GAS);
        log.info(`Retrieved Balance for ${address} from neonDB ${net}`);
        return bal;
    });
}
exports.getBalance = getBalance;
/**
 * Get amounts of available (spent) and unavailable claims.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Claim>} An object with available and unavailable GAS amounts.
 */
function getClaims(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v2/address/claims/" + address);
        const data = response.data;
        const claims = data.claims.map(c => {
            return {
                claim: new neon_core_1.u.Fixed8(c.claim).div(100000000),
                index: c.index,
                txid: c.txid,
                start: new neon_core_1.u.Fixed8(c.start),
                end: new neon_core_1.u.Fixed8(c.end),
                value: c.value
            };
        });
        log.info(`Retrieved Claims for ${address} from neonDB ${net}`);
        return new neon_core_1.wallet.Claims({ net, address, claims });
    });
}
exports.getClaims = getClaims;
;
/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Fixed8>} An object with available and unavailable GAS amounts.
 */
exports.getMaxClaimAmount = (net, address) => {
    const apiEndpoint = getAPIEndpoint(net);
    return axios_1.default.get(apiEndpoint + "/v2/address/claims/" + address).then(res => {
        log.info(`Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neonDB ${net}`);
        return new Fixed8(res.data.total_claim + res.data.total_unspent_claim).div(100000000);
    });
};
/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} a list of PastTransaction
 */
exports.getTransactionHistory = (net, address) => {
    const apiEndpoint = getAPIEndpoint(net);
    return axios_1.default
        .get(apiEndpoint + "/v2/address/history/" + address)
        .then(response => {
        log.info(`Retrieved History for ${address} from neonDB ${net}`);
        return response.data.history.map(rawTx => {
            return {
                change: {
                    NEO: new Fixed8(rawTx.NEO || 0),
                    GAS: new Fixed8(rawTx.GAS || 0)
                },
                blockHeight: new Fixed8(rawTx.block_index),
                txid: rawTx.txid
            };
        });
    });
};
/**
 * Get the current height of the light wallet DB
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<number>} Current height.
 */
exports.getWalletDBHeight = net => {
    const apiEndpoint = getAPIEndpoint(net);
    return axios_1.default.get(apiEndpoint + "/v2/block/height").then(response => {
        return parseInt(response.data.block_height);
    });
};
//# sourceMappingURL=neonDB.js.map