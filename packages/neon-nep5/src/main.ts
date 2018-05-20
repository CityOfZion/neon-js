import { logging, rpc, sc, tx, u, wallet } from "@cityofzion/neon-core";

const log = logging.default("nep5");

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  balance?: number;
}

function parseDecimals(VMOutput: string): number {
  if (VMOutput === "") {
    return 0;
  }
  return parseInt(VMOutput, 10);
}

function parseHexNum(hex: string): number {
  return hex ? parseInt(u.reverseHex(hex), 16) : 0;
}

const parseTokenInfo = rpc.VMZip(
  u.hexstring2str,
  u.hexstring2str,
  parseDecimals,
  parseHexNum
);

const parseTokenInfoAndBalance = rpc.VMZip(
  u.hexstring2str,
  u.hexstring2str,
  parseDecimals,
  parseHexNum,
  parseHexNum
);

export const getTokenBalance = async (
  url: string,
  scriptHash: string,
  address: string
): Promise<number> => {
  const addrScriptHash = u.reverseHex(wallet.getScriptHashFromAddress(address));
  const sb = new sc.ScriptBuilder();
  const script = sb
    .emitAppCall(scriptHash, "decimals")
    .emitAppCall(scriptHash, "balanceOf", [addrScriptHash]).str;

  try {
    const res = await rpc.Query.invokeScript(script).execute(url);
    const decimals = parseDecimals(res.result.stack[0].value);
    return parseHexNum(res.result.stack[1].value) / Math.pow(10, decimals);
  } catch (err) {
    log.error(`getTokenBalance failed with : ${err.message}`);
    throw err;
  }
};

export const getToken = async (
  url: string,
  scriptHash: string,
  address?: string
): Promise<TokenInfo> => {
  const parser = address ? parseTokenInfoAndBalance : parseTokenInfo;
  const sb = new sc.ScriptBuilder();
  sb
    .emitAppCall(scriptHash, "name")
    .emitAppCall(scriptHash, "symbol")
    .emitAppCall(scriptHash, "decimals")
    .emitAppCall(scriptHash, "totalSupply");
  if (address) {
    const addrScriptHash = u.reverseHex(
      wallet.getScriptHashFromAddress(address)
    );
    sb.emitAppCall(scriptHash, "balanceOf", [addrScriptHash]);
  }
  const script = sb.str;
  try {
    const res = await rpc.Query.invokeScript(script)
      .parseWith(parser)
      .execute(url);
    const result: TokenInfo = {
      name: res[0],
      symbol: res[1],
      decimals: res[2],
      totalSupply: res[3] / Math.pow(10, res[2])
    };
    if (address) {
      result.balance = res.length === 5 ? res[4] / Math.pow(10, res[2]) : 0;
    }
    return result;
  } catch (err) {
    log.error(`getToken failed with : ${err.message}`);
    throw err;
  }
};
