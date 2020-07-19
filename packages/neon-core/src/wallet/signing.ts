import BN from "bn.js";
import { sha256, getCurve, EllipticCurvePreset, EcdsaSignature } from "../u";
import { getPrivateKeyFromWIF, getPublicKeyUnencoded } from "./core";
import { isPublicKey, isWIF } from "./verify";

const curve = getCurve(EllipticCurvePreset.SECP256R1);
/**
 * Converts signatureHex to a signature object with r & s.
 */
function getSignatureFromHex(signatureHex: string): EcdsaSignature {
  const signatureBuffer = Buffer.from(signatureHex, "hex");
  const r = new BN(signatureBuffer.slice(0, 32).toString("hex"), 16, "be");
  const s = new BN(signatureBuffer.slice(32).toString("hex"), 16, "be");
  return { r, s };
}

/**
 * Generates a ECDSA signature from a hexstring using the given private key.
 * @param hex - hexstring to hash.
 * @param privateKey - hexstring or WIF format.
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
  return sig.r.toString("hex", 32) + sig.s.toString("hex", 32);
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
  const ecdsaSignature = getSignatureFromHex(sig);
  const messageHash = sha256(hex);
  return curve.verify(messageHash, ecdsaSignature, publicKey);
}
