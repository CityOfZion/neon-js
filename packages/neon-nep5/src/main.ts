import { logging, rpc, sc, u } from "@cityofzion/neon-core";
import * as abi from "./abi";
const log = logging.default("nep5");

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  balance?: u.Fixed8;
}

/**
 * Workaround for contracts such as SWTH returning Integer instead of ByteArray.
 */
function NumberParser(item: sc.StackItemLike): u.Fixed8 {
  switch (item.type) {
    case "Integer":
      return new u.Fixed8(item.value as string).div(100000000);
    case "ByteArray":
      return u.Fixed8.fromReverseHex(item.value as string);
    default:
      throw new Error(`Received invalid type ${item.type}`);
  }
}

const parseTokenInfo = rpc.buildParser(
  rpc.StringParser,
  rpc.StringParser,
  rpc.IntegerParser,
  NumberParser
);

const parseTokenInfoAndBalance = rpc.buildParser(
  rpc.StringParser,
  rpc.StringParser,
  rpc.IntegerParser,
  NumberParser,
  NumberParser
);

/**
 * Get the balance of a single token for a single address.
 * @param url Url of the NEO node to query.
 * @param scriptHash ScriptHash of the NEP5 contract.
 * @param address the Address to query for the balance.
 */
export async function getTokenBalance(
  url: string | rpc.RPCClient,
  scriptHash: string,
  address: string
): Promise<u.Fixed8> {
  const client = typeof url === "string" ? new rpc.RPCClient(url) : url;
  const sb = new sc.ScriptBuilder();
  abi.decimals(scriptHash)(sb);
  abi.balanceOf(scriptHash, address)(sb);
  const script = sb.str;
  try {
    const res = await client.invokeScript(script);
    const decimals = rpc.IntegerParser(res.stack[0]);
    return NumberParser(res.stack[1]).mul(Math.pow(10, 8 - decimals));
  } catch (err) {
    log.error(`getTokenBalance failed with : ${err.message}`);
    throw err;
  }
}

/**
 * Get token balances for an address.
 * @param url URL of the NEO node to query.
 * @param scriptHashArray Array of contract scriptHashes.
 * @param address Address to query for balance of tokens.
 */
export async function getTokenBalances(
  url: string | rpc.RPCClient,
  scriptHashArray: string[],
  address: string
): Promise<{ [symbol: string]: u.Fixed8 }> {
  const sb = new sc.ScriptBuilder();
  scriptHashArray.forEach((scriptHash) => {
    abi.symbol(scriptHash)(sb);
    abi.decimals(scriptHash)(sb);
    abi.balanceOf(scriptHash, address)(sb);
  });

  const client = typeof url === "string" ? new rpc.RPCClient(url) : url;
  const res = await client.invokeScript(sb.str);
  const tokenList = {} as { [symbol: string]: u.Fixed8 };
  if (!res || !res.stack || res.stack.length !== 3 * scriptHashArray.length) {
    throw new Error("Stack returned was invalid");
  }
  try {
    for (let i = 0; i < res.stack.length; i += 3) {
      try {
        const symbol = rpc.StringParser(res.stack[i]);
        const decimals = rpc.IntegerParser(res.stack[i + 1]);
        tokenList[symbol] = NumberParser(res.stack[i + 2]).mul(
          Math.pow(10, 8 - decimals)
        );
      } catch (e) {
        log.error(`single call in getTokenBalances failed with : ${e.message}`);
        throw e;
      }
    }
    return tokenList;
  } catch (err) {
    log.error(`getTokenBalances failed with : ${err.message}`);
    throw err;
  }
}

/**
 * Retrieves the complete information about a token.
 * @param url RPC Node url to query.
 * @param scriptHash ScriptHash of the NEP5 contract.
 * @param address Optional address to query the balance for. If provided, the returned object will include the balance property.
 */
export async function getToken(
  url: string | rpc.RPCClient,
  scriptHash: string,
  address?: string
): Promise<TokenInfo> {
  const parser = address ? parseTokenInfoAndBalance : parseTokenInfo;
  const sb = new sc.ScriptBuilder();
  abi.name(scriptHash)(sb);
  abi.symbol(scriptHash)(sb);
  abi.decimals(scriptHash)(sb);
  abi.totalSupply(scriptHash)(sb);
  if (address) {
    abi.balanceOf(scriptHash, address)(sb);
  }
  const script = sb.str;
  try {
    const client = typeof url === "string" ? new rpc.RPCClient(url) : url;
    const res = parser(await client.invokeScript(script));
    const result: TokenInfo = {
      name: res[0],
      symbol: res[1],
      decimals: res[2],
      totalSupply: res[3].mul(Math.pow(10, 8 - res[2])).toNumber(),
    };
    if (address) {
      result.balance = res[4].mul(Math.pow(10, 8 - res[2]));
    }
    return result;
  } catch (err) {
    log.error(`getToken failed with : ${err.message}`);
    throw err;
  }
}

/**
 * Retrieves the complete information about a list of tokens.
 * @param url RPC Node url to query.
 * @param scriptHashArray Array of NEP5 contract scriptHashes.
 * @param address Optional address to query the balance for. If provided, the returned object will include the balance property.
 */
export async function getTokens(
  url: string | rpc.RPCClient,
  scriptHashArray: string[],
  address?: string
): Promise<TokenInfo[]> {
  try {
    const sb = new sc.ScriptBuilder();
    scriptHashArray.forEach((scriptHash) => {
      abi.name(scriptHash)(sb);
      abi.symbol(scriptHash)(sb);
      abi.decimals(scriptHash)(sb);
      abi.totalSupply(scriptHash)(sb);
      if (address) {
        abi.balanceOf(scriptHash, address)(sb);
      }
    });

    const client = typeof url === "string" ? new rpc.RPCClient(url) : url;
    const res = await client.invokeScript(sb.str);

    const result: TokenInfo[] = [];
    const step = address ? 5 : 4;
    for (let i = 0; i < res.stack.length; i += step) {
      const name = rpc.StringParser(res.stack[i]);
      const symbol = rpc.StringParser(res.stack[i + 1]);
      const decimals = rpc.IntegerParser(res.stack[i + 2]);
      const totalSupply = NumberParser(res.stack[i + 3])
        .mul(Math.pow(10, 8 - decimals))
        .toNumber();
      const balance = address
        ? NumberParser(res.stack[i + 4]).mul(Math.pow(10, 8 - decimals))
        : undefined;

      const obj = {
        name,
        symbol,
        decimals,
        totalSupply,
        balance,
      };

      if (!obj.balance) {
        delete obj.balance;
      }

      result.push(obj);
    }
    return result;
  } catch (err) {
    log.error(`getTokens failed with : ${err.message}`);
    throw err;
  }
}
