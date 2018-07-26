"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neon_core_1 = require("@cityofzion/neon-core");
function name(scriptHash) {
    return (sb = new neon_core_1.sc.ScriptBuilder()) => {
        return sb.emitAppCall(scriptHash, "name");
    };
}
exports.name = name;
function symbol(scriptHash) {
    return (sb = new neon_core_1.sc.ScriptBuilder()) => {
        return sb.emitAppCall(scriptHash, "symbol");
    };
}
exports.symbol = symbol;
function decimals(scriptHash) {
    return (sb = new neon_core_1.sc.ScriptBuilder()) => {
        return sb.emitAppCall(scriptHash, "decimals");
    };
}
exports.decimals = decimals;
function totalSupply(scriptHash) {
    return (sb = new neon_core_1.sc.ScriptBuilder()) => {
        return sb.emitAppCall(scriptHash, "totalSupply");
    };
}
exports.totalSupply = totalSupply;
function balanceOf(scriptHash, addr) {
    return (sb = new neon_core_1.sc.ScriptBuilder()) => {
        const addressHash = addressToScriptHash(addr);
        return sb.emitAppCall(scriptHash, "balanceOf", [addressHash]);
    };
}
exports.balanceOf = balanceOf;
function transfer(scriptHash, fromAddr, toAddr, amt) {
    return (sb = new neon_core_1.sc.ScriptBuilder()) => {
        const fromHash = addressToScriptHash(fromAddr);
        const toHash = addressToScriptHash(toAddr);
        const amtBytes = new neon_core_1.u.Fixed8(amt).toReverseHex();
        return sb.emitAppCall(scriptHash, "transfer", [fromHash, toHash, amtBytes]);
    };
}
exports.transfer = transfer;
function addressToScriptHash(address) {
    return neon_core_1.u.reverseHex(neon_core_1.wallet.getScriptHashFromAddress(address));
}
//# sourceMappingURL=abi.js.map