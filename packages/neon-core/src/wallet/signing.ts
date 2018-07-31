// tslint:disable-next-line:no-reference
/// <reference path="../../typings/elliptic.d.ts" />
import BN from "bn.js";
import { ec as EC, Signature } from "elliptic";
import { sha256 } from "../u";
import { getPrivateKeyFromWIF, getPublicKeyUnencoded } from "./core";
import { isPublicKey, isWIF } from "./verify";

export const curve = new EC("p256");

export function sign(hex: string, privateKey: string) {
  if (isWIF(privateKey)) {
    privateKey = getPrivateKeyFromWIF(privateKey);
  }
  const msgHash = sha256(hex);
  const msgHashHex = Buffer.from(msgHash, "hex");

  const sig = curve.sign(msgHashHex, privateKey);
  return sig.r.toString("hex",32) + sig.s.toString("hex",32);
}

export function verify(hex: string, sig: string, publicKey: string) {
  if (!isPublicKey(publicKey)) {
    throw new Error("Invalid public key");
  }
  if (!isPublicKey(publicKey, true)) {
    publicKey = getPublicKeyUnencoded(publicKey);
  }
  const sigObj = getSignatureFromHex(sig) as Signature;
  const messageHash = sha256(hex);
  return curve.verify(messageHash, sigObj, publicKey, "hex");
}

/**
 * Converts signatureHex to a signature object with r & s.
 * @param {string} signatureHex
 */
const getSignatureFromHex = (signatureHex: string) => {
  const signatureBuffer = Buffer.from(signatureHex, "hex");
  const r = new BN(signatureBuffer.slice(0, 32).toString("hex"), 16, "be");
  const s = new BN(signatureBuffer.slice(32).toString("hex"), 16, "be");
  return { r, s };
};
