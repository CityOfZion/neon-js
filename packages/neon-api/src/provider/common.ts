import { rpc, u } from "@cityofzion/neon-core";
import { Account } from "@cityofzion/neon-core/lib/wallet";
import { ScriptIntent } from "@cityofzion/neon-core/lib/sc";
export interface PastTransaction {
  txid: string;
  blockHeight: number;
  change: { [assetSymbol: string]: u.Fixed8 };
}

export interface Balance {
  [index: string]: number;
}

export interface SendAssetConfig {
  from: Account | string;
  to: string;
  asset: string;
  amount: number;
}

export interface Provider {
  name: string;
  getRPCEndpoint(noCache?: boolean): Promise<string>;
  getHeight(): Promise<number>;
  getTransactionHistory(address: string): Promise<PastTransaction[]>;
}

export interface DataProvider extends Provider {
  getAPIEndpoint(net: string): string;
  /**
   * Get balance of certain address
   * @param addr
   */
  getBalance(addr: string): Promise<Balance>;
  getMaxClaimAmount(addr: string): Promise<number>;
  claimGas(account: Account | string): Promise<boolean>;
  sendAsset(...configs: SendAssetConfig[]): Promise<boolean>;
  readInvoke(...intents: (string | ScriptIntent)[]): Promise<any>;
  invoke(...intents: (string | ScriptIntent)[]): Promise<boolean>;
}

export interface RpcNode {
  height: number;
  url: string;
}

export function filterHttpsOnly(nodes: RpcNode[]): RpcNode[] {
  return nodes.filter(n => n.url.includes("https://"));
}

export async function raceToSuccess<T>(promises: Promise<T>[]): Promise<T> {
  try {
    const errors = await Promise.all(
      promises.map(p => p.then(val => Promise.reject(val), err => err))
    );
    return await Promise.reject(errors);
  } catch (success) {
    return success;
  }
}

export async function getBestUrl(rpcs: RpcNode[]): Promise<string> {
  const clients = rpcs.map(r => new rpc.RPCClient(r.url));
  return await raceToSuccess(clients.map(c => c.ping().then(_ => c.net)));
}

export function findGoodNodesFromHeight(
  nodes: RpcNode[],
  tolerance: number = 1
): RpcNode[] {
  if (nodes.length === 0) {
    throw new Error("No eligible nodes found!");
  }
  const sortedNodes = nodes.slice().sort((n1, n2) => n2.height - n1.height);
  const bestHeight = sortedNodes[0].height;
  const threshold = bestHeight - tolerance;
  return sortedNodes.filter(n => n.height >= threshold);
}
