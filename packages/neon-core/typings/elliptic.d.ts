declare module "elliptic" {
  import BN from "bn.js";
  export const version: string;

  export interface utils {
    assert(val: any, msg: string): void;
    toArray(msg: string | number[] | undefined, enc: string): number[];
    zero2(word: string): string;
    toHex(msg: number[]): string;
    encode(arr: number[], enc: string): string | number[];
  }
  export interface rand {}

  export interface curve {
    [name: string]: PresetCurve;
  }

  export interface PresetCurve {
    curve: any;
    g: any;
    n: any;
    hash: any;
  }

  export interface curves {}

  export type PubKey =
    | string
    | { x: string; y: string }
    | { x: Buffer; y: Buffer }
    | { x: ArrayLike<number>; y: ArrayLike<number> };

  export type SignatureType = string | Buffer | Signature;

  export class ec {
    curve: any;
    n: any;
    nh: any;
    g: any;
    hash: any;

    constructor(options: string | PresetCurve | object);
    keyPair(options: KeyPairOptions): KeyPair;
    keyFromPrivate(priv: string, enc: string): KeyPair;
    keyFromPublic(pub: PubKey, enc: string): KeyPair;
    genKeyPair(options?: KeyPairOptions): KeyPair;
    sign(
      msg: ArrayLike<number> | string,
      key: BN | string,
      options?: HmacDRBGOptions
    ): Signature;
    sign(
      msg: ArrayLike<number> | string,
      key: BN | string,
      enc: string | object,
      options?: HmacDRBGOptions
    ): Signature;
    verify(
      msg: ArrayLike<number> | string,
      signature: SignatureType,
      key: PubKey,
      enc: string
    ): boolean;
  }

  interface KeyPairOptions {
    priv?: any;
    privEnc?: string;
    pub?: any;
    pubEnc?: string;
  }

  interface HmacDRBGOptions {
    pers: any;
    persEnc?: string;
    entropy?: any;
    entropyEnc?: any;
  }

  class KeyPair {
    EC: any;
    priv: any;
    pub: any;

    constructor(ec: any, options: KeyPairOptions);
    static fromPublic(ec: any, pub: any, enc: string): KeyPair;
    static fromPrivate(ec: any, priv: any, enc: string): KeyPair;

    getPublic(compact?: string, enc?: string): any;
    getPrivate(enc: string): any;
    validate(): { result: boolean; reason: string | null };
    derive(pub: BN): BN;
    sign(msg: string, enc: string, options: any): Signature;
    verify(msg: string, signature: any): any;
    inspect(): string;
  }

  class Signature {
    r: BN;
    s: BN;
    recoveryParam?: number | null;
    constructor(options: { r: BN; s: BN; recoveryParam: number }, enc?: any);

    toDER(enc: string): any;
  }

  export interface eddsa {}
}
