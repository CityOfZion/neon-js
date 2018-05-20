import { sc, u, wallet } from "@cityofzion/neon-core";

export function name(scriptHash: string) {
  return () => {
    return new sc.ScriptBuilder().emitAppCall(scriptHash, "name").str;
  };
}

export function symbol(scriptHash: string) {
  return () => {
    return new sc.ScriptBuilder().emitAppCall(scriptHash, "symbol").str;
  };
}

export function decimals(scriptHash: string) {
  return () => {
    return new sc.ScriptBuilder().emitAppCall(scriptHash, "decimals").str;
  };
}

export function totalSupply(scriptHash: string) {
  return () => {
    return new sc.ScriptBuilder().emitAppCall(scriptHash, "totalSupply").str;
  };
}

export function balanceOf(scriptHash: string) {
  return (addr: string) => {
    const addressHash = addressToScriptHash(addr);
    return new sc.ScriptBuilder().emitAppCall(scriptHash, "balanceOf", [
      addressHash
    ]).str;
  };
}

export function transfer(scriptHash: string) {
  return (fromAddr: string, toAddr: string, amt: u.Fixed8 | number) => {
    const fromHash = addressToScriptHash(fromAddr);
    const toHash = addressToScriptHash(toAddr);
    const amtBytes = new u.Fixed8(amt).toReverseHex();
    return new sc.ScriptBuilder().emitAppCall(scriptHash, "transfer", [
      fromHash,
      toHash,
      amtBytes
    ]).str;
  };
}

function addressToScriptHash(address: string) {
  return u.reverseHex(wallet.getScriptHashFromAddress(address));
}
