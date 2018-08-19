import { rpc, u, wallet } from "@cityofzion/neon-core";
export interface PastTransaction {
  txid: string;
  blockHeight: number;
  change: { [assetSymbol: string]: u.Fixed8 };
}

export interface Provider {
  name: string;
  getRPCEndpoint(noCache?: boolean): Promise<string>;
  getBalance(address: string): Promise<wallet.Balance>;
  getClaims(address: string): Promise<wallet.Claims>;
  getMaxClaimAmount(address: string): Promise<u.Fixed8>;
  getHeight(): Promise<number>;
  getTransactionHistory(address: string): Promise<PastTransaction[]>;
}

export interface DataProvider extends Provider {
  getAPIEndpoint(net: string): string;
}

export interface RpcNode {
  height: number;
  url: string;
}

export function filterHttpsOnly(nodes: RpcNode[]): RpcNode[] {
  return nodes.filter(n => n.url.includes("https://"));
}

export async function getBestUrl(rpcs: RpcNode[]): Promise<string> {
  const clients = rpcs.map(r => new rpc.RPCClient(r.url));
  return await Promise.race(clients.map(c => c.ping().then(_ => c.net)));
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
  for (let i = 1; i < sortedNodes.length; i++) {
    if (sortedNodes[i].height < threshold) {
      return sortedNodes.slice(0, i);
    }
  }
  return sortedNodes;
}
