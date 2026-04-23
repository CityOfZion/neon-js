import { p256 } from "@noble/curves/p256";
import { secp256k1 } from "@noble/curves/secp256k1";
import { Buffer } from "buffer";

export interface EcdsaSignature {
  r: string;
  s: string;
}

type NobleCurve = typeof p256;

function bytesToHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("hex");
}

function hexToBytes(hex: string): Uint8Array {
  return Buffer.from(hex, "hex");
}

function numberToPaddedHex(value: bigint, bytesLength: number): string {
  return value.toString(16).padStart(bytesLength * 2, "0");
}

function hexToNumber(hex: string): bigint {
  if (hex.length === 0) {
    return 0n;
  }
  return BigInt(`0x${hex}`);
}

function bytesToNumber(bytes: Uint8Array): bigint {
  return hexToNumber(bytesToHex(bytes));
}

function mod(value: bigint, modulo: bigint): bigint {
  const result = value % modulo;
  return result >= 0n ? result : result + modulo;
}

function invert(value: bigint, modulo: bigint): bigint {
  if (value === 0n || modulo <= 0n) {
    throw new Error("invert: expected positive integers");
  }

  let a = mod(value, modulo);
  let b = modulo;
  let x = 0n;
  let y = 1n;
  let u = 1n;
  let v = 0n;

  while (a !== 0n) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a;
    a = r;
    x = u;
    y = v;
    u = m;
    v = n;
  }

  if (b !== 1n) {
    throw new Error("invert: does not exist");
  }

  return mod(x, modulo);
}

function bitsToNumber(bytes: Uint8Array, bitsLength: number): bigint {
  const num = bytesToNumber(bytes);
  const excess = BigInt(bytes.length * 8 - bitsLength);
  return excess > 0n ? num >> excess : num;
}

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

function parseNonce(k: number | string): bigint {
  if (typeof k === "number") {
    if (!Number.isInteger(k)) {
      throw new Error("k must be an integer");
    }
    return BigInt(k);
  }
  return hexToNumber(k);
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
   * @param k - number or hexstring between 0 and the n parameter of the curve. Provide this if you wish to generate a deterministic signature. Do note that there are security implications if you do.
   */
  public sign(
    message: string,
    privateKey: string,
    k?: number | string,
  ): EcdsaSignature {
    if (k !== undefined) {
      const kNumber = parseNonce(k);
      const n = this.curve.CURVE.n;
      if (kNumber <= 0n) {
        throw new Error("k must be a positive number");
      }
      if (kNumber >= n) {
        throw new Error(`k must be smaller than ${n.toString(10)}`);
      }

      return this.signWithNonce(message, privateKey, kNumber);
    }
    const signature = this.curve.sign(
      hexToBytes(message),
      hexToBytes(privateKey),
      { lowS: false },
    );
    const bytesLength = this.getScalarBytesLength();
    return {
      r: numberToPaddedHex(signature.r, bytesLength),
      s: numberToPaddedHex(signature.s, bytesLength),
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
    return bytesToHex(this.curve.getPublicKey(hexToBytes(privateKey), encode));
  }

  /**
   * Decodes an encoded public key to its unencoded form.
   * @param publicKey - 33 byte hexstring starting with 02 or 03.
   */
  public decodePublicKey(publicKey: string): string {
    return bytesToHex(
      this.curve.ProjectivePoint.fromHex(hexToBytes(publicKey)).toRawBytes(
        false,
      ),
    );
  }

  private signWithNonce(
    message: string,
    privateKey: string,
    requestedNonce: bigint,
  ): EcdsaSignature {
    const n = this.curve.CURVE.n;
    const bytesLength = this.getScalarBytesLength();
    const msg = mod(
      bitsToNumber(hexToBytes(message), this.getScalarBitsLength()),
      n,
    );
    const privateScalar = bytesToNumber(hexToBytes(privateKey));

    let attempt = 0n;
    while (attempt < requestedNonce) {
      const nonce = requestedNonce / (attempt + 1n);
      if (nonce <= 0n) {
        break;
      }

      const point = this.curve.ProjectivePoint.BASE.multiply(nonce).toAffine();
      const r = mod(point.x, n);
      if (r === 0n) {
        attempt += 1n;
        continue;
      }

      const s = mod(invert(nonce, n) * mod(msg + r * privateScalar, n), n);
      if (s === 0n) {
        attempt += 1n;
        continue;
      }

      return {
        r: numberToPaddedHex(r, bytesLength),
        s: numberToPaddedHex(s, bytesLength),
      };
    }

    throw new Error("Unable to generate signature with provided k");
  }

  private getScalarBytesLength(): number {
    const bytesLength = this.curve.CURVE.nByteLength;
    if (bytesLength === undefined) {
      throw new Error("Curve scalar byte length is unavailable");
    }
    return bytesLength;
  }

  private getScalarBitsLength(): number {
    const bitsLength = this.curve.CURVE.nBitLength;
    if (bitsLength === undefined) {
      throw new Error("Curve scalar bit length is unavailable");
    }
    return bitsLength;
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
