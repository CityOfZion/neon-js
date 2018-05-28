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
exports.name = "neoscan";
const rpcCache = new helper_1.RpcCache();
/**
 * Returns the appropriate NeoScan endpoint.
 * @param net Name of network to retrieve the endpoint from. Alternatively, provide a custom url.
 */
function getAPIEndpoint(net) {
    if (neon_core_1.settings.networks[net]) {
        return neon_core_1.settings.networks[net].extra.neoscan;
    }
    return net;
}
exports.getAPIEndpoint = getAPIEndpoint;
/**
 * Returns an appropriate RPC endpoint retrieved from a NeoScan endpoint.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @returns URL of a good RPC endpoint.
 */
function getRPCEndpoint(net) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v1/get_all_nodes");
        let nodes = response.data;
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
 * Gets balance for an address. Returns an empty Balance if endpoint returns not found.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address Address to check.
 * @return Balance of address retrieved from endpoint.
 */
function getBalance(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v1/get_balance/" + address);
        const data = response.data;
        if (data.address === "not found" && data.balance === null) {
            return new neon_core_1.wallet.Balance({
                address: data.address
            });
        }
        const bal = new neon_core_1.wallet.Balance({
            address: data.address
        });
        const neoscanBalances = data.balance;
        neoscanBalances.map(b => {
            bal.addAsset(b.asset, {
                balance: b.amount,
                unspent: parseUnspent(b.unspent)
            });
        });
        log.info(`Retrieved Balance for ${address} from neoscan ${net}`);
        return bal;
    });
}
exports.getBalance = getBalance;
function parseUnspent(unspentArr) {
    return unspentArr.map(coin => {
        return {
            index: coin.n,
            txid: coin.txid,
            value: coin.value
        };
    });
}
/**
 * Get claimable amounts for an address. Returns an empty Claims if endpoint returns not found.
 * @param net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address - Address to check.
 * @return Claims retrieved from endpoint.
 */
function getClaims(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v1/get_claimable/" + address);
        const data = response.data;
        if (data.address === "not found" && data.claimable === null) {
            return new neon_core_1.wallet.Claims({ address: data.address });
        }
        const claims = parseClaims(data.claimable);
        log.info(`Retrieved Balance for ${address} from neoscan ${net}`);
        return new neon_core_1.wallet.Claims({
            net,
            address: data.address,
            claims
        });
    });
}
exports.getClaims = getClaims;
function parseClaims(claimArr) {
    return claimArr.map(c => {
        return {
            start: c.start_height,
            end: c.end_height,
            index: c.n,
            claim: c.unclaimed,
            txid: c.txid,
            value: c.value
        };
    });
}
/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param net 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param address Address to check.
 * @return
 */
function getMaxClaimAmount(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v1/get_unclaimed/" + address);
        const data = response.data;
        log.info(`Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neoscan ${net}`);
        return new neon_core_1.u.Fixed8(data.unclaimed || 0);
    });
}
exports.getMaxClaimAmount = getMaxClaimAmount;
/**
 * Get the current height of the light wallet DB
 * @param net 'MainNet' or 'TestNet'.
 * @return  Current height as reported by provider
 */
function getHeight(net) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v1/get_height");
        const data = response.data;
        return new neon_core_1.u.Fixed8(data.height);
    });
}
exports.getHeight = getHeight;
/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} A listof PastTransactionPastTransaction[]
 */
function getTransactionHistory(net, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiEndpoint = getAPIEndpoint(net);
        const response = yield axios_1.default.get(apiEndpoint + "/v1/get_last_transactions_by_address/" + address);
        const data = response.data;
        log.info(`Retrieved History for ${address} from neoscan ${net}`);
        return parseTxHistory(response.data, address);
    });
}
exports.getTransactionHistory = getTransactionHistory;
function parseTxHistory(rawTxs, address) {
    return rawTxs.map(tx => {
        const vin = tx.vin
            .filter(i => i.address_hash === address)
            .map(i => ({ asset: i.asset, value: i.value }));
        const vout = tx.vouts
            .filter(o => o.address_hash === address)
            .map(i => ({ asset: i.asset, value: i.value }));
        const change = {
            NEO: getChange(vin, vout, neon_core_1.CONST.ASSET_ID.NEO),
            GAS: getChange(vin, vout, neon_core_1.CONST.ASSET_ID.GAS)
        };
        return {
            txid: tx.txid,
            blockHeight: new neon_core_1.u.Fixed8(tx.block_height),
            change
        };
    });
}
function getChange(vin, vout, assetId) {
    const totalOut = vin
        .filter(i => i.asset === assetId)
        .reduce((p, c) => p.add(c.value), new neon_core_1.u.Fixed8(0));
    const totalIn = vout
        .filter(i => i.asset === assetId)
        .reduce((p, c) => p.add(c.value), new neon_core_1.u.Fixed8(0));
    return totalIn.minus(totalOut);
}
//# sourceMappingURL=neoscan.js.map