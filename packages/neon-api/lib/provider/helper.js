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
class RpcCache {
    constructor() {
        this.cachedRPC = undefined;
    }
    findBestRPC(urls, acceptablePing = 2000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cachedRPC && urls.indexOf(this.cachedRPC.net)) {
                const ping = yield this.cachedRPC.ping();
                if (ping <= acceptablePing) {
                    return this.cachedRPC.net;
                }
            }
            this.cachedRPC = undefined;
            const newBestUrl = yield getBestUrl(urls);
            this.cachedRPC = new neon_core_1.rpc.RPCClient(newBestUrl);
            return newBestUrl;
        });
    }
}
exports.RpcCache = RpcCache;
function getBestUrl(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        const clients = urls.map(url => new neon_core_1.rpc.RPCClient(url));
        return yield Promise.race(clients.map(c => c.ping().then(_ => c.net)));
    });
}
exports.getBestUrl = getBestUrl;
function filterHttpsOnly(nodes) {
    return nodes.filter(n => n.url.includes("https://"));
}
exports.filterHttpsOnly = filterHttpsOnly;
function findGoodNodesFromHeight(nodes, tolerance = 1) {
    let bestHeight = 0;
    let goodNodes = [];
    for (const node of nodes) {
        if (node.height > bestHeight) {
            bestHeight = node.height;
            goodNodes = [node];
        }
        else if (node.height + tolerance >= bestHeight) {
            goodNodes.push(node);
        }
    }
    return goodNodes;
}
exports.findGoodNodesFromHeight = findGoodNodesFromHeight;
//# sourceMappingURL=helper.js.map