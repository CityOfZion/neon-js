"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neon_core_1 = require("@cityofzion/neon-core");
function name(scriptHash) {
    return () => {
        return new neon_core_1.sc.ScriptBuilder().emitAppCall(scriptHash, "name").str;
    };
}
exports.name = name;
function symbol(scriptHash) {
    return () => {
        return new neon_core_1.sc.ScriptBuilder().emitAppCall(scriptHash, "symbol").str;
    };
}
exports.symbol = symbol;
function decimals(scriptHash) {
    return () => {
        return new neon_core_1.sc.ScriptBuilder().emitAppCall(scriptHash, "decimals").str;
    };
}
exports.decimals = decimals;
function totalSupply(scriptHash) {
    return () => {
        return new neon_core_1.sc.ScriptBuilder().emitAppCall(scriptHash, "totalSupply").str;
    };
}
exports.totalSupply = totalSupply;
function balanceOf(scriptHash) {
    return (addr) => {
        const addressHash = addressToScriptHash(addr);
        return new neon_core_1.sc.ScriptBuilder().emitAppCall(scriptHash, "balanceOf", [
            addressHash
        ]).str;
    };
}
exports.balanceOf = balanceOf;
function transfer(scriptHash) {
    return (fromAddr, toAddr, amt) => {
        const fromHash = addressToScriptHash(fromAddr);
        const toHash = addressToScriptHash(toAddr);
        const amtBytes = new neon_core_1.u.Fixed8(amt).toReverseHex();
        return new neon_core_1.sc.ScriptBuilder().emitAppCall(scriptHash, "transfer", [
            fromHash,
            toHash,
            amtBytes
        ]).str;
    };
}
exports.transfer = transfer;
function addressToScriptHash(address) {
    return neon_core_1.u.reverseHex(neon_core_1.wallet.getScriptHashFromAddress(address));
}
