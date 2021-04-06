import { enc } from "crypto-js";

export function hex2base64(input: string): string {
  return enc.Base64.stringify(enc.Hex.parse(input));
}

export function base642hex(input: string): string {
  return enc.Base64.parse(input).toString(enc.Hex);
}

export function utf82base64(input: string): string {
  return enc.Utf8.stringify(enc.Base64.parse(input));
}

export function base642utf8(input: string): string {
  return enc.Base64.parse(input).toString(enc.Utf8);
}
