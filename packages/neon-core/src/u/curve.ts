import { ec as EC } from "elliptic";
import BN from "bn.js";

export interface EcdsaSignature {
  r: BN;
  s: BN;
}

export class EllipticCurve {
  private curve: EC;

  public constructor(preset: string) {
    this.curve = new EC(preset);
  }

  public sign(
    message: string,
    privateKey: string,
    k?: number | string
  ): EcdsaSignature {
    const signature =
      k !== undefined
        ? this.curve.sign(
            Buffer.from(message, "hex"),
            Buffer.from(privateKey, "hex"),
            { k: (i: number) => new BN(k).divn(i + 1) } as any
          )
        : this.curve.sign(
            Buffer.from(message, "hex"),
            Buffer.from(privateKey, "hex")
          );
    return signature;
    // return {
    //   r: signature.r.toString("hex", 32),
    //   s: signature.s.toString("hex", 32),
    // };
  }

  public verify(
    messageHash: string,
    signature: EcdsaSignature,
    publicKey: string
  ): boolean {
    return this.curve.verify(
      messageHash,
      {
        r: new BN(signature.r, 16, "be"),
        s: new BN(signature.s, 16, "be"),
      },
      Buffer.from(publicKey, "hex"),
      "hex"
    );
  }

  public getPublicKey(privateKey: string, encode = true): string {
    const privateKeyBuffer = Buffer.from(privateKey, "hex");
    return this.curve
      .keyFromPrivate(privateKeyBuffer, "hex")
      .getPublic()
      .encode("hex", encode);
  }

  public decodePublicKey(publicKey: string): string {
    const publicKeyBuffer = Buffer.from(publicKey, "hex");
    return this.curve
      .keyFromPublic(publicKeyBuffer, "hex")
      .getPublic()
      .encode("hex", false);
  }
}

export enum EllipticCurvePreset {
  SECP256R1,
  SECP256K1,
}

const curves = {
  [EllipticCurvePreset.SECP256R1]: new EllipticCurve("p256"),
  [EllipticCurvePreset.SECP256K1]: new EllipticCurve("secp256k1"),
};

export function getCurve(curveName: EllipticCurvePreset): EllipticCurve {
  return curves[curveName];
}
