import { u } from "@cityofzion/neon-core";
export interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
    balance?: u.Fixed8;
}
export declare const getTokenBalance: (url: string, scriptHash: string, address: string) => Promise<u.Fixed8>;
export declare const getToken: (url: string, scriptHash: string, address?: string | undefined) => Promise<TokenInfo>;
//# sourceMappingURL=main.d.ts.map