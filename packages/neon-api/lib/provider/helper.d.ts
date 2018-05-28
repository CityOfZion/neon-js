import { rpc } from "@cityofzion/neon-core";
export interface RpcNode {
    height: number;
    url: string;
}
export declare class RpcCache {
    cachedRPC: rpc.RPCClient | undefined;
    constructor();
    findBestRPC(urls: string[], acceptablePing?: number): Promise<string>;
}
export declare function getBestUrl(urls: string[]): Promise<string>;
export declare function filterHttpsOnly(nodes: RpcNode[]): RpcNode[];
export declare function findGoodNodesFromHeight(nodes: RpcNode[], tolerance?: number): RpcNode[];
