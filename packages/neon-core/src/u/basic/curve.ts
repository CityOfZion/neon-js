import { p256 } from "@noble/curves/p256";
import { secp256k1 } from "@noble/curves/secp256k1";
import { bytesToHex, hexToBytes } from "@noble/curves/utils";

export interface EcdsaSignature {
  r: string;
  s: string;
}

type NobleCurve = typeof p256;

const SIGNATURE_COMPONENT_HEX_LENGTH = 32 * 2;

function getNobleCurve(preset: string): NobleCurve {
  switch (preset) {
    case "p256":
      return p256;
    case "secp256k1":
      return secp256k1;
    default:
      throw new Error(`Unsupported curve preset: ${preset}`);
  }
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
  private curve: NobleCurve;

  public constructor(preset: string) {
    this.curve = getNobleCurve(preset);
  }

  /**
   * Signs a message with the given private key.
   * @param message - hexstring message.
   * @param privateKey - hexstring.
   * @param _k - deprecated and ignored. Custom nonce signing is not supported.
   */
  public sign(
    message: string,
    privateKey: string,
    _k?: number | string,
  ): EcdsaSignature {
    const signature = this.curve.sign(hexToBytes(message), privateKey, {
      lowS: true,
    });
    const compactSignature = signature.toHex("compact");
    return {
      r: compactSignature.slice(0, SIGNATURE_COMPONENT_HEX_LENGTH),
      s: compactSignature.slice(SIGNATURE_COMPONENT_HEX_LENGTH),
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
    publicKey: string,
  ): boolean {
    return this.curve.verify(
      hexToBytes(signature.r + signature.s),
      hexToBytes(message),
      hexToBytes(publicKey),
      { lowS: false },
    );
  }

  /**
   * Generates the public key from the given private key. Encoding it results in a shorter public key.
   * @param privateKey - 64 byte hexstring.
   * @param encode - whether to return the compressed form.
   */
  public getPublicKey(privateKey: string, encode = true): string {
    return bytesToHex(this.curve.getPublicKey(privateKey, encode));
  }

  /**
   * Decodes an encoded public key to its unencoded form.
   * @param publicKey - 33 byte hexstring starting with 02 or 03.
   */
  public decodePublicKey(publicKey: string): string {
    return this.curve.ProjectivePoint.fromHex(publicKey).toHex(false);
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
  const curve = curves[curveName];
  if (curve === undefined) {
    throw new Error(`Unsupported curve preset: ${curveName}`);
  }
  return curve;
}
