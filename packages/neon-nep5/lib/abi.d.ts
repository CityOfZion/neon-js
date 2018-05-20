import { sc } from "@cityofzion/neon-core";
export declare function name(scriptHash: string): () => string;
export declare function symbol(scriptHash: string): () => string;
export declare function decimals(scriptHash: string): () => string;
export declare function totalSupply(scriptHash: string): () => string;
export declare function balanceOf(scriptHash: string): (addr: string) => string;
export declare function transfer(scriptHash: string): (fromAddr: string, toAddr: string, amt: number | sc.Fixed8) => string;
