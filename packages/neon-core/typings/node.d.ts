import { EncodeIntoResult } from "util";

declare global {
  class TextEncoder {
    readonly encoding: string;
    encode(input?: string): Uint8Array;
    encodeInto(input: string, output: Uint8Array): EncodeIntoResult;
  }
}
