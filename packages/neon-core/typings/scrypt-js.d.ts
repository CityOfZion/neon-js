declare module "scrypt-js" {
  export default function(
    password: Buffer,
    salt: Buffer,
    N: number,
    r: number,
    p: number,
    dkLen: number,
    callback: (error: Error, progress: number, keys: string) => void
  ): void;
}
