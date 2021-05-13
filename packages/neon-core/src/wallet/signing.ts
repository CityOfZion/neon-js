import BN from "bn.js";
import { ec as EC } from "elliptic";
import { sha256 } from "../u";
import { getPrivateKeyFromWIF, getPublicKeyUnencoded } from "./core";
import { isPublicKey, isWIF } from "./verify";

export const curve = new EC("p256");

/**
 * Converts signatureHex to a signature object with r & s.
 */
function getSignatureFromHex(signatureHex: string): { r: BN; s: BN } {
  const signatureBuffer = Buffer.from(signatureHex, "hex");
  const r = new BN(signatureBuffer.slice(0, 32).toString("hex"), 16, "be");
  const s = new BN(signatureBuffer.slice(32).toString("hex"), 16, "be");
  return { r, s };
}

/**
 * Generates a ECDSA signature from a hexstring using the given private key.
 * @param hex Hexstring to hash.
 * @param privateKey Hexstring or WIF format.
 */
export function sign(hex: string, privateKey: string): string {
  if (isWIF(privateKey)) {
    privateKey = getPrivateKeyFromWIF(privateKey);
  }
  const msgHash = sha256(hex);
  const msgHashHex = Buffer.from(msgHash, "hex");
  const privateKeyBuffer = Buffer.from(privateKey, "hex");

  const sig = curve.sign(msgHashHex, privateKeyBuffer);
  return sig.r.toString("hex", 32) + sig.s.toString("hex", 32);
}

/**
 * Verifies that the message, signature and signing key matches.
 * @param hex Message that was signed.
 * @param sig ECDSA signature.
 * @param publicKey encoded/unencoded public key of the signing key.
 */
export function verify(hex: string, sig: string, publicKey: string): boolean {
  if (!isPublicKey(publicKey)) {
    throw new Error("Invalid public key");
  }
  if (!isPublicKey(publicKey, true)) {
    publicKey = getPublicKeyUnencoded(publicKey);
  }
  const sigObj = getSignatureFromHex(sig) as unknown as EC.SignatureOptions;
  const messageHash = sha256(hex);
  const publicKeyBuffer = Buffer.from(publicKey, "hex");
  return curve.verify(messageHash, sigObj, publicKeyBuffer, "hex");
}
