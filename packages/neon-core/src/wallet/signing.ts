import { sha256, getCurve, EllipticCurvePreset } from "../u";
import { getPrivateKeyFromWIF, getPublicKeyUnencoded } from "./core";
import { isPublicKey, isWIF } from "./verify";

const curve = getCurve(EllipticCurvePreset.SECP256R1);

/**
 * Generates a ECDSA signature from a hexstring using the given private key.
 * @param hex - hexstring to hash.
 * @param privateKey - hexstring or WIF format.
 * @param k - optional nonce for generating a signature. Providing this value will cause the signature generated to be deterministic.
 * @returns a 64 byte hexstring made from (r+s)
 */
export function sign(
  hex: string,
  privateKey: string,
  k?: number | string
): string {
  if (isWIF(privateKey)) {
    privateKey = getPrivateKeyFromWIF(privateKey);
  }
  const msgHash = sha256(hex);
  const sig = curve.sign(msgHash, privateKey, k);
  return sig.r + sig.s;
}

/**
 * Verifies that the message, signature and signing key matches.
 * @param hex - message that was signed.
 * @param sig - ECDSA signature in the form of a 64 byte hexstring (r+s).
 * @param publicKey - encoded/unencoded public key of the signing key.
 */
export function verify(hex: string, sig: string, publicKey: string): boolean {
  if (!isPublicKey(publicKey)) {
    throw new Error("Invalid public key");
  }
  if (!isPublicKey(publicKey, true)) {
    publicKey = getPublicKeyUnencoded(publicKey);
  }
  const ecdsaSignature = {
    r: sig.substr(0, 64),
    s: sig.substr(64, 64),
  };
  const messageHash = sha256(hex);
  return curve.verify(messageHash, ecdsaSignature, publicKey);
}

/**
 * Generates a signature of the transaction based on given private key.
 * @param tx - serialized unsigned transaction
 * @param privateKey - private Key
 * @returns Signature. Does not include tx.
 *
 * @deprecated please use sign(tx, privateKey).
 */
export function generateSignature(tx: string, privateKey: string): string {
  return sign(tx, privateKey);
}
