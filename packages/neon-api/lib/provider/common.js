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
function filterHttpsOnly(nodes) {
    return nodes.filter(n => n.url.includes("https://"));
}
exports.filterHttpsOnly = filterHttpsOnly;
function isCachedRPCAcceptable(cachedUrl, rpcs, acceptablePing = 2000) {
    return __awaiter(this, void 0, void 0, function* () {
        const urls = rpcs.map(r => r.url);
        if (urls.indexOf(cachedUrl) >= 0) {
            const client = new neon_core_1.rpc.RPCClient(cachedUrl);
            const ping = yield client.ping();
            if (ping <= acceptablePing) {
                return true;
            }
        }
        return false;
    });
}
exports.isCachedRPCAcceptable = isCachedRPCAcceptable;
function getBestUrl(rpcs) {
    return __awaiter(this, void 0, void 0, function* () {
        const clients = rpcs.map(r => new neon_core_1.rpc.RPCClient(r.url));
        return yield Promise.race(clients.map(c => c.ping().then(_ => c.net)));
    });
}
exports.getBestUrl = getBestUrl;
function findGoodNodesFromHeight(nodes, tolerance = 1) {
    if (nodes.length === 0) {
        throw new Error("No eligible nodes found!");
    }
    const sortedNodes = nodes.slice().sort((n1, n2) => n2.height - n1.height);
    const bestHeight = sortedNodes[0].height;
    const threshold = bestHeight - tolerance;
    for (let i = 1; i < sortedNodes.length; i++) {
        if (sortedNodes[i].height < threshold) {
            return sortedNodes.slice(0, i);
        }
    }
    return sortedNodes;
}
exports.findGoodNodesFromHeight = findGoodNodesFromHeight;
//# sourceMappingURL=common.js.map