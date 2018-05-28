import { rpc } from "@cityofzion/neon-core";

export interface RpcNode {
  height: number;
  url: string;
}

export class RpcCache {
  public cachedRPC: rpc.RPCClient | undefined;

  constructor() {
    this.cachedRPC = undefined;
  }

  public async findBestRPC(
    urls: string[],
    acceptablePing = 2000
  ): Promise<string> {
    if (this.cachedRPC && urls.indexOf(this.cachedRPC.net)) {
      const ping = await this.cachedRPC.ping();
      if (ping <= acceptablePing) {
        return this.cachedRPC.net;
      }
    }
    this.cachedRPC = undefined;
    const newBestUrl = await getBestUrl(urls);
    this.cachedRPC = new rpc.RPCClient(newBestUrl);
    return newBestUrl;
  }
}

export async function getBestUrl(urls: string[]): Promise<string> {
  const clients = urls.map(url => new rpc.RPCClient(url));
  return await Promise.race(clients.map(c => c.ping().then(_ => c.net)));
}

export function filterHttpsOnly(nodes: RpcNode[]): RpcNode[] {
  return nodes.filter(n => n.url.includes("https://"));
}

export function findGoodNodesFromHeight(
  nodes: RpcNode[],
  tolerance: number = 1
): RpcNode[] {
  let bestHeight = 0;
  let goodNodes: RpcNode[] = [];
  for (const node of nodes) {
    if (node.height > bestHeight) {
      bestHeight = node.height;
      goodNodes = [node];
    } else if (node.height + tolerance >= bestHeight) {
      goodNodes.push(node);
    }
  }
  return goodNodes;
}
