import { u, wallet } from "@cityofzion/neon-core";
export interface PastTransaction {
    txid: string;
    blockHeight: number;
    change: {
        [assetSymbol: string]: u.Fixed8;
    };
}
export interface Provider {
    name: string;
    getRPCEndpoint(net: string): Promise<string>;
    getBalance(net: string, address: string): Promise<wallet.Balance>;
    getClaims(net: string, address: string): Promise<wallet.Claims>;
    getMaxClaimAmount(net: string, address: string): Promise<u.Fixed8>;
    getHeight(net: string): Promise<number>;
    getTransactionHistory(net: string, address: string): Promise<PastTransaction[]>;
}
export interface DataProvider extends Provider {
    getAPIEndpoint(net: string): string;
}
export interface RpcNode {
    height: number;
    url: string;
}
export declare function filterHttpsOnly(nodes: RpcNode[]): RpcNode[];
export declare function isCachedRPCAcceptable(cachedUrl: string, rpcs: RpcNode[], acceptablePing?: number): Promise<boolean>;
export declare function getBestUrl(rpcs: RpcNode[]): Promise<string>;
export declare function findGoodNodesFromHeight(nodes: RpcNode[], tolerance?: number): RpcNode[];
//# sourceMappingURL=common.d.ts.map