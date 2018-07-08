declare module "secure-random" {
  export default function(
    byteCount: number,
    options?: { type: "Array" | "Uint8Array" | "Buffer" }
  ): number[] | Uint8Array | Buffer;
}
