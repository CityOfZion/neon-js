import { StackItemLike } from "../sc";
import { Fixed8, hexstring2str } from "../u";

export interface RPCVMResponse {
  script: string;
  state: "HALT, BREAK" | "FAULT, BREAK";
  gas_consumed: string;
  stack: StackItemLike[];
}

export type StackItemParser = (item: StackItemLike) => any;

export type VMResultParser = (result: RPCVMResponse) => any[];

export function buildParser(...args: StackItemParser[]): VMResultParser {
  return (result: RPCVMResponse) => {
    if (result.stack.length !== args.length) {
      throw new Error(
        `Wrong number of items to parse! Expected ${args.length} but got ${
          result.stack.length
        }!`
      );
    }

    return result.stack.map((item, i) => args[i](item));
  };
}

export function NoOpParser(item: StackItemLike): any {
  return item.value;
}

export function IntegerParser(item: StackItemLike): number {
  return parseInt((item.value as string) || "0", 10);
}

export function StringParser(item: StackItemLike): string {
  return hexstring2str(item.value as string);
}

export function Fixed8Parser(item: StackItemLike): Fixed8 {
  return Fixed8.fromReverseHex(item.value as string);
}

/**
 * Parses the VM Stack and returns human readable strings
 * @param res RPC Response
 * @return Array of results
 */
export function SimpleParser(res: RPCVMResponse): any[] {
  return res.stack.map(item => {
    switch (item.type) {
      case "ByteArray":
        return StringParser(item);
      case "Integer":
        return IntegerParser(item);
      default:
        throw Error(`Unknown type: ${item.type}`);
    }
  });
}
