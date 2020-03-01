declare module "scrypt-js" {
  export function scrypt(
    password: Buffer,
    salt: Buffer,
    N: number,
    r: number,
    p: number,
    dkLen: number,
    callback: (error: Error, progress: number, keys: string) => void
  ): Promise<Uint8Array>;

  export function syncScrypt(
    password: Buffer,
    salt: Buffer,
    N: number,
    r: number,
    p: number,
    dkLen: number
  ): Uint8Array;
}
