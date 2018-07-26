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
const common_1 = require("../common");
const settings_1 = require("../../settings");
const log = neon_core_1.logging.default("api");
exports.name = "neonDB";
let cachedUrl = "";
/**
 * Returns the appropriate neonDB endpoint.
 * @param net Name of network to retrieve the endpoint from. Alternatively, provide a custom url.
 * @return URL of API endpoint.
 */
function getAPIEndpoint(net) {
    if (neon_core_1.settings.networks[net]) {
        const url = neon_core_1.settings.networks[net].extra.neonDB;
        if (!url) {
            throw new Error(`No neonDB url found for ${net}`);
        }
        return url;
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
        const data = response.data.nodes;
        let nodes = data
            .filter(d => d.status)
            .map(d => ({ height: d.block_height, url: d.url }));
        if (settings_1.settings.httpsOnly) {
            nodes = common_1.filterHttpsOnly(nodes);
        }
        const goodNodes = common_1.findGoodNodesFromHeight(nodes);
        if (cachedUrl) {
            const useCachedUrl = common_1.isCachedRPCAcceptable(cachedUrl, goodNodes);
            if (useCachedUrl) {
                return cachedUrl;
            }
        }
        const bestRPC = yield common_1.getBestUrl(goodNodes);
        cachedUrl = bestRPC;
        return bestRPC;
    });
}
exports.getRPCEndpoint = getRPCEndpoint;
/**
 * Get balances of NEO and GAS for an address
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return  Balance of address
 */
function getBalance(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v2/address/balance/" + address);
        const data = response.data;
        const bal = new neon_core_1.wallet.Balance({ net, address });
        if (data.NEO.balance > 0) {
            bal.addAsset("NEO", data.NEO);
        }
        if (data.GAS.balance > 0) {
            bal.addAsset("GAS", data.GAS);
        }
        log.info(`Retrieved Balance for ${address} from neonDB ${net}`);
        return bal;
    });
}
exports.getBalance = getBalance;
/**
 * Get amounts of available (spent) and unavailable claims.
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return An object with available and unavailable GAS amounts.
 */
function getClaims(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v2/address/claims/" + address);
        const data = response.data;
        const claims = data.claims.map(c => {
            return {
                claim: new neon_core_1.u.Fixed8(c.claim || 0).div(100000000),
                index: c.index,
                txid: c.txid,
                start: c.start || 0,
                end: c.end || 0,
                value: c.value
            };
        });
        log.info(`Retrieved Claims for ${address} from neonDB ${net}`);
        return new neon_core_1.wallet.Claims({ net, address, claims });
    });
}
exports.getClaims = getClaims;
/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return An object with available and unavailable GAS amounts.
 */
function getMaxClaimAmount(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v2/address/claims/" + address);
        const data = response.data;
        log.info(`Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neonDB ${net}`);
        return new neon_core_1.u.Fixed8(data.total_claim + data.total_unspent_claim).div(100000000);
    });
}
exports.getMaxClaimAmount = getMaxClaimAmount;
/**
 * Get transaction history for an account
 * @param net - 'MainNet' or 'TestNet'.
 * @param address - Address to check.
 * @return a list of PastTransaction
 */
function getTransactionHistory(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v2/address/history/" + address);
        const data = response.data;
        log.info(`Retrieved History for ${address} from neonDB ${net}`);
        return data.history.map(rawTx => {
            return {
                change: {
                    NEO: new neon_core_1.u.Fixed8(rawTx.NEO || 0),
                    GAS: new neon_core_1.u.Fixed8(rawTx.GAS || 0)
                },
                blockHeight: rawTx.block_index,
                txid: rawTx.txid
            };
        });
    });
}
exports.getTransactionHistory = getTransactionHistory;
/**
 * Get the current height of the light wallet DB
 * @param net - 'MainNet' or 'TestNet'.
 * @return Current height.
 */
exports.getHeight = (net) => {
    const apiEndpoint = getAPIEndpoint(net);
    return axios_1.default.get(apiEndpoint + "/v2/block/height").then(response => {
        return parseInt(response.data.block_height, 10);
    });
};
//# sourceMappingURL=index.js.map