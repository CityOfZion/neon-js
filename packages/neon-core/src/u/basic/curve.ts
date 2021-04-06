import { ec as EC } from "elliptic";
import BN from "bn.js";
import { Buffer } from "buffer";

export interface EcdsaSignature {
  r: string;
  s: string;
}

/**
 * Interface for providing elliptic cryptography methods. Instead of instantiating your own curve, you should be getting a curve through getCurve.
 *
 * @example
 *
 * const curve = getCurve(EllipticCurvePreset.SECP256R1);
 * const message = tx.serialize();
 * const signature = curve.sign(message, privateKey);
 */
export class EllipticCurve {
  private curve: EC;

  public constructor(preset: string) {
    this.curve = new EC(preset);
  }

  /**
   * Signs a message with the given private key.
   * @param message - hexstring message.
   * @param privateKey - hexstring.
   * @param k - number or hexstring between 0 and the n parameter of the curve. Provide this if you wish to generate a deterministic signature. Do note that there are security implications if you do.
   */
  public sign(
    message: string,
    privateKey: string,
    k?: number | string
  ): EcdsaSignature {
    if (k !== undefined) {
      const kNumber =
        typeof k === "number" ? new BN(k) : new BN(k, "hex", "be");
      if (kNumber.cmpn(0) <= 0) {
        throw new Error("k must be a positive number");
      }
      if (this.curve.n && kNumber.cmp(this.curve.n) >= 0) {
        throw new Error(`k must be smaller than ${this.curve.n.toString(10)}`);
      }

      const signature = this.curve.sign(
        Buffer.from(message, "hex"),
        Buffer.from(privateKey, "hex"),
        // typing error
        { k: (i: number) => new BN(kNumber).divn(i + 1) } as never
      );
      return {
        r: signature.r.toString("hex", 32),
        s: signature.s.toString("hex", 32),
      };
    }
    const signature = this.curve.sign(
      Buffer.from(message, "hex"),
      Buffer.from(privateKey, "hex")
    );
    return {
      r: signature.r.toString("hex", 32),
      s: signature.s.toString("hex", 32),
    };
  }

  /**
   * Validates a signature against the original message and the public key of the signing key.
   * @param message - the original hexstring message.
   * @param signature - the signature.
   * @param publicKey - encoded or unencoded public key.
   */
  public verify(
    message: string,
    signature: EcdsaSignature,
    publicKey: string
  ): boolean {
    return this.curve.verify(
      message,
      {
        r: new BN(signature.r, 16, "be"),
        s: new BN(signature.s, 16, "be"),
      },
      Buffer.from(publicKey, "hex"),
      "hex"
    );
  }

  /**
   * Generates the public key from the given private key. Encoding it results in a shorter public key.
   * @param privateKey - 64 byte hexstring.
   * @param encode - whether to return the compressed form.
   */
  public getPublicKey(privateKey: string, encode = true): string {
    const privateKeyBuffer = Buffer.from(privateKey, "hex");
    return this.curve
      .keyFromPrivate(privateKeyBuffer, "hex")
      .getPublic()
      .encode("hex", encode);
  }

  /**
   * Decodes an encoded public key to its unencoded form.
   * @param publicKey - 33 byte hexstring starting with 02 or 03.
   */
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
