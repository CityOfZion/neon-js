import { sc, u } from "@cityofzion/neon-core";
export declare function name(scriptHash: string): (sb?: sc.ScriptBuilder) => sc.ScriptBuilder;
export declare function symbol(scriptHash: string): (sb?: sc.ScriptBuilder) => sc.ScriptBuilder;
export declare function decimals(scriptHash: string): (sb?: sc.ScriptBuilder) => sc.ScriptBuilder;
export declare function totalSupply(scriptHash: string): (sb?: sc.ScriptBuilder) => sc.ScriptBuilder;
export declare function balanceOf(scriptHash: string, addr: string): (sb?: sc.ScriptBuilder) => sc.ScriptBuilder;
export declare function transfer(scriptHash: string, fromAddr: string, toAddr: string, amt: u.Fixed8 | number): (sb?: sc.ScriptBuilder) => sc.ScriptBuilder;
//# sourceMappingURL=abi.d.ts.map