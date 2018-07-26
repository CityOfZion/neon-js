"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const neon_core_1 = require("@cityofzion/neon-core");
const abi = __importStar(require("./abi"));
const log = neon_core_1.logging.default("nep5");
const parseTokenInfo = neon_core_1.rpc.buildParser(neon_core_1.rpc.StringParser, neon_core_1.rpc.StringParser, neon_core_1.rpc.IntegerParser, neon_core_1.rpc.Fixed8Parser);
const parseTokenInfoAndBalance = neon_core_1.rpc.buildParser(neon_core_1.rpc.StringParser, neon_core_1.rpc.StringParser, neon_core_1.rpc.IntegerParser, neon_core_1.rpc.Fixed8Parser, neon_core_1.rpc.Fixed8Parser);
exports.getTokenBalance = (url, scriptHash, address) => __awaiter(this, void 0, void 0, function* () {
    const sb = new neon_core_1.sc.ScriptBuilder();
    abi.decimals(scriptHash)(sb);
    abi.balanceOf(scriptHash, address)(sb);
    const script = sb.str;
    try {
        const res = yield neon_core_1.rpc.Query.invokeScript(script).execute(url);
        const decimals = neon_core_1.rpc.IntegerParser(res.result.stack[0]);
        return neon_core_1.rpc
            .Fixed8Parser(res.result.stack[1])
            .mul(Math.pow(10, 8 - decimals));
    }
    catch (err) {
        log.error(`getTokenBalance failed with : ${err.message}`);
        throw err;
    }
});
exports.getToken = (url, scriptHash, address) => __awaiter(this, void 0, void 0, function* () {
    const parser = address ? parseTokenInfoAndBalance : parseTokenInfo;
    const sb = new neon_core_1.sc.ScriptBuilder();
    abi.name(scriptHash)(sb);
    abi.symbol(scriptHash)(sb);
    abi.decimals(scriptHash)(sb);
    abi.totalSupply(scriptHash)(sb);
    if (address) {
        abi.balanceOf(scriptHash, address)(sb);
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
            totalSupply: res[3].div(Math.pow(10, 8 - res[2])).toNumber()
        };
        if (address) {
            result.balance = res[4].div(Math.pow(10, 8 - res[2]));
        }
        return result;
    }
    catch (err) {
        log.error(`getToken failed with : ${err.message}`);
        throw err;
    }
});
//# sourceMappingURL=main.js.map