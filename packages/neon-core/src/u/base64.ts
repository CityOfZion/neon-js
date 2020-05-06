import { enc } from "crypto-js";

export function base64Encode(input: string): string {
  return enc.Base64.stringify(enc.Utf8.parse(input));
}

export function base64Decode(input: string): string {
  return enc.Base64.parse(input).toString(enc.Utf8);
}
