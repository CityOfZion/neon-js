import { sc, u, wallet } from "@cityofzion/neon-core";

export function name(scriptHash: string) {
  return (sb = new sc.ScriptBuilder()) => {
    return sb.emitAppCall(scriptHash, "name");
  };
}

export function symbol(scriptHash: string) {
  return (sb = new sc.ScriptBuilder()) => {
    return sb.emitAppCall(scriptHash, "symbol");
  };
}

export function decimals(scriptHash: string) {
  return (sb = new sc.ScriptBuilder()) => {
    return sb.emitAppCall(scriptHash, "decimals");
  };
}

export function totalSupply(scriptHash: string) {
  return (sb = new sc.ScriptBuilder()) => {
    return sb.emitAppCall(scriptHash, "totalSupply");
  };
}

export function balanceOf(scriptHash: string, addr: string) {
  return (sb = new sc.ScriptBuilder()) => {
    const addressHash = addressToScriptHash(addr);
    return sb.emitAppCall(scriptHash, "balanceOf", [addressHash]);
  };
}

export function transfer(
  scriptHash: string,
  fromAddr: string,
  toAddr: string,
  amt: u.Fixed8 | number
) {
  return (sb = new sc.ScriptBuilder()) => {
    const fromHash = addressToScriptHash(fromAddr);
    const toHash = addressToScriptHash(toAddr);
    const amtBytes = new u.Fixed8(amt).toReverseHex();
    return sb.emitAppCall(scriptHash, "transfer", [fromHash, toHash, amtBytes]);
  };
}

function addressToScriptHash(address: string) {
  return u.reverseHex(wallet.getScriptHashFromAddress(address));
}
