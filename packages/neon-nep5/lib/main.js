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
const log = neon_core_1.logging.default("nep5");
function parseDecimals(VMOutput) {
    if (VMOutput === "") {
        return 0;
    }
    return parseInt(VMOutput, 10);
}
function parseHexNum(hex) {
    return hex ? parseInt(neon_core_1.u.reverseHex(hex), 16) : 0;
}
const parseTokenInfo = neon_core_1.rpc.VMZip(neon_core_1.u.hexstring2str, neon_core_1.u.hexstring2str, parseDecimals, parseHexNum);
const parseTokenInfoAndBalance = neon_core_1.rpc.VMZip(neon_core_1.u.hexstring2str, neon_core_1.u.hexstring2str, parseDecimals, parseHexNum, parseHexNum);
exports.getTokenBalance = (url, scriptHash, address) => __awaiter(this, void 0, void 0, function* () {
    const addrScriptHash = neon_core_1.u.reverseHex(neon_core_1.wallet.getScriptHashFromAddress(address));
    const sb = new neon_core_1.sc.ScriptBuilder();
    const script = sb
        .emitAppCall(scriptHash, "decimals")
        .emitAppCall(scriptHash, "balanceOf", [addrScriptHash]).str;
    try {
        const res = yield neon_core_1.rpc.Query.invokeScript(script).execute(url);
        const decimals = parseDecimals(res.result.stack[0].value);
        return parseHexNum(res.result.stack[1].value) / Math.pow(10, decimals);
    }
    catch (err) {
        log.error(`getTokenBalance failed with : ${err.message}`);
        throw err;
    }
});
exports.getToken = (url, scriptHash, address) => __awaiter(this, void 0, void 0, function* () {
    const parser = address ? parseTokenInfoAndBalance : parseTokenInfo;
    const sb = new neon_core_1.sc.ScriptBuilder();
    sb
        .emitAppCall(scriptHash, "name")
        .emitAppCall(scriptHash, "symbol")
        .emitAppCall(scriptHash, "decimals")
        .emitAppCall(scriptHash, "totalSupply");
    if (address) {
        const addrScriptHash = neon_core_1.u.reverseHex(neon_core_1.wallet.getScriptHashFromAddress(address));
        sb.emitAppCall(scriptHash, "balanceOf", [addrScriptHash]);
    }
    const script = sb.str;
    try {
        const res = yield neon_core_1.rpc.Query.invokeScript(script)
            .parseWith(parser)
            .execute(url);
        const result = {
            name: res[0],
            symbol: res[1],
            decimals: res[2],
            totalSupply: res[3] / Math.pow(10, res[2])
        };
        if (address) {
            result.balance = res.length === 5 ? res[4] / Math.pow(10, res[2]) : 0;
        }
        return result;
    }
    catch (err) {
        log.error(`getToken failed with : ${err.message}`);
        throw err;
    }
});
