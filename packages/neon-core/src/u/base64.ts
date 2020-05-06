import { enc } from "crypto-js";

export function hex2base64(input: string): string {
  return enc.Base64.stringify(enc.Hex.parse(input));
}

export function base642hex(input: string): string {
  return enc.Base64.parse(input).toString(enc.Hex);
}
