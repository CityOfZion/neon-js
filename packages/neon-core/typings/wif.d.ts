declare module "wif" {
  export function encode(
    version: number,
    privateKey: Buffer,
    compressed: boolean
  ): string;
  export function decode(
    wif: string,
    version: number
  ): { version: number; privateKey: Buffer; compressed: boolean };
}
