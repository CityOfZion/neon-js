declare module "bs58check" {
  export function decode(string: string): Buffer;
  export function encode(payload: Buffer): string;
}
