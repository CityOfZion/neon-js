import { StackItemLike } from "../sc";
import { Fixed8, hexstring2str } from "../u";
import { InvokeResult } from "./Query";

export type StackItemParser = (item: StackItemLike) => unknown;

export type VMResultParser = (result: InvokeResult) => unknown[];

/**
 * Builds a parser to parse the results of the stack.
 * @param args - A list of functions to parse arguments. Each function is mapped to its corresponding StackItem in the result.
 * @returns parser function
 */
export function buildParser(...args: StackItemParser[]): VMResultParser {
  return (result: InvokeResult): unknown[] => {
    if (result.stack.length !== args.length) {
      throw new Error(
        `Wrong number of items to parse! Expected ${args.length} but got ${result.stack.length}!`
      );
    }

    return result.stack.map((item, i) => args[i](item));
  };
}

/**
 * This just returns the value of the StackItem.
 */
export function NoOpParser(item: StackItemLike): unknown {
  return item.value;
}

/**
 * Parses the result to an integer.
 */
export function IntegerParser(item: StackItemLike): number {
  return parseInt((item.value as string) || "0", 10);
}

/**
 *  Parses the result to a ASCII string.
 */
export function StringParser(item: StackItemLike): string {
  return hexstring2str(item.value as string);
}

/**
 * Parses the result to a Fixed8.
 */
export function Fixed8Parser(item: StackItemLike): Fixed8 {
  return Fixed8.fromReverseHex(item.value as string);
}

/**
 * Parses the VM Stack and returns human readable strings. The types are inferred based on the StackItem type.
 * @param res - RPC Response
 * @returns Array of results
 */
export function SimpleParser(res: InvokeResult): unknown[] {
  return res.stack.map((item) => {
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
