import { StackItemLike } from "../sc";
import { Fixed8 } from "../u";
export interface RPCVMResponse {
    script: string;
    state: "HALT, BREAK" | "FAULT, BREAK";
    gas_consumed: string;
    stack: StackItemLike[];
}
export declare type StackItemParser = (item: StackItemLike) => any;
export declare type VMResultParser = (result: RPCVMResponse) => any[];
export declare function buildParser(...args: StackItemParser[]): VMResultParser;
export declare function NoOpParser(item: StackItemLike): any;
export declare function IntegerParser(item: StackItemLike): number;
export declare function StringParser(item: StackItemLike): string;
export declare function Fixed8Parser(item: StackItemLike): Fixed8;
/**
 * Parses the VM Stack and returns human readable strings
 * @param res RPC Response
 * @return Array of results
 */
export declare function SimpleParser(res: RPCVMResponse): any[];
//# sourceMappingURL=parse.d.ts.map