import { StackItemJson } from "../sc";
import { hexstring2str } from "../u";
import { InvokeResult } from "./Query";

export type StackItemParser = (item: StackItemJson) => unknown;

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
        `Wrong number of items to parse! Expected ${args.length} but got ${result.stack.length}!`,
      );
    }

    return result.stack.map((item, i) => args[i](item));
  };
}

/**
 * This just returns the value of the StackItem.
 */
export function NoOpParser(item: StackItemJson): unknown {
  if (item.type === "InteropInterface")
    throw new Error("Impossible to get value from InteropInterface type");

  return item.value;
}

/**
 * Parses the result to an integer.
 */
export function IntegerParser(item: StackItemJson): number {
  if (item.type === "InteropInterface")
    throw new Error("Impossible to get value from InteropInterface type");

  if (typeof item.value !== "string") {
    throw new Error("value received is not a string");
  }
  return parseInt(item.value || "0", 10);
}

/**
 *  Parses the result to a ASCII string.
 */
export function StringParser(item: StackItemJson): string {
  if (item.type === "InteropInterface")
    throw new Error("Impossible to get value from InteropInterface type");

  if (typeof item.value !== "string") {
    throw new Error("value received is not a string");
  }
  return hexstring2str(item.value);
}

/**
 * Parses the VM Stack and returns human readable strings. The types are inferred based on the StackItem type.
 * @param res - RPC Response
 * @returns Array of results
 */
export function SimpleParser(res: InvokeResult): unknown[] {
  return res.stack.map((item) => {
    switch (item.type) {
      case "ByteString":
        return StringParser(item);
      case "Integer":
        return IntegerParser(item);
      default:
        throw Error(`Unknown type: ${item.type}`);
    }
  });
}
