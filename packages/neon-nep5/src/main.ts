import { logging, rpc, sc, u, wallet } from "@cityofzion/neon-core";

const log = logging.default("nep5");

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  balance?: u.Fixed8;
}

const parseTokenInfo = rpc.buildParser(
  rpc.StringParser,
  rpc.StringParser,
  rpc.IntegerParser,
  rpc.Fixed8Parser
);

const parseTokenInfoAndBalance = rpc.buildParser(
  rpc.StringParser,
  rpc.StringParser,
  rpc.IntegerParser,
  rpc.Fixed8Parser,
  rpc.Fixed8Parser
);

export const getTokenBalance = async (
  url: string,
  scriptHash: string,
  address: string
): Promise<u.Fixed8> => {
  const addrScriptHash = u.reverseHex(wallet.getScriptHashFromAddress(address));
  const sb = new sc.ScriptBuilder();
  const script = sb
    .emitAppCall(scriptHash, "decimals")
    .emitAppCall(scriptHash, "balanceOf", [addrScriptHash]).str;

  try {
    const res = await rpc.Query.invokeScript(script).execute(url);
    const decimals = rpc.IntegerParser(res.result.stack[0]);
    return rpc
      .Fixed8Parser(res.result.stack[1])
      .mul(Math.pow(10, 8 - decimals));
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
  sb.emitAppCall(scriptHash, "name")
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
      totalSupply: res[3].div(Math.pow(10, 8 - res[2])).toNumber()
    };
    if (address) {
      result.balance = res[4].div(Math.pow(10, 8 - res[2]));
    }
    return result;
  } catch (err) {
    log.error(`getToken failed with : ${err.message}`);
    throw err;
  }
};
