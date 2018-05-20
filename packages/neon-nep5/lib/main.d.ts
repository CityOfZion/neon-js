export interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
    balance?: number;
}
export declare const getTokenBalance: (url: string, scriptHash: string, address: string) => Promise<number>;
export declare const getToken: (url: string, scriptHash: string, address?: string | undefined) => Promise<TokenInfo>;
