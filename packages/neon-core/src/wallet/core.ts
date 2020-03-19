/**
 * @file Core methods for manipulating keys
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 * Keys are arranged in order of derivation.
 * Arrows determine the direction.
 *
 * NEP2 methods are found within NEP2 standard.
 * All methods take in Big-Endian strings and return Big-Endian strings.
 */
import base58 from "bs58";
import { Buffer } from "buffer";
import WIF from "wif";
import { ADDR_VERSION } from "../consts";
import { ab2hexstring, hash160, hash256, hexstring2ab, reverseHex } from "../u";
import { generateRandomArray } from "../u/random";
import { curve, sign } from "./signing";

/**
 * Encodes a public key.
 * @param unencodedKey unencoded public key
 * @return encoded public key
 */
export function getPublicKeyEncoded(unencodedKey: string): string {
  const publicKeyArray = new Uint8Array(hexstring2ab(unencodedKey));
  if (publicKeyArray[64] % 2 === 1) {
    return "03" + ab2hexstring(publicKeyArray.slice(1, 33));
  } else {
    return "02" + ab2hexstring(publicKeyArray.slice(1, 33));
  }
}

/**
 * Unencodes a public key.
 * @param  publicKey Encoded public key
 * @return decoded public key
 */
export function getPublicKeyUnencoded(publicKey: string): string {
  const publicKeyBuffer = Buffer.from(publicKey, "hex");
  const keyPair = curve.keyFromPublic(publicKeyBuffer, "hex");
  return keyPair.getPublic().encode("hex", false);
}

/**
 * Converts a WIF to private key.
 */
export function getPrivateKeyFromWIF(wif: string): string {
  return ab2hexstring(WIF.decode(wif, 128).privateKey);
}

/**
 * Converts a private key to WIF.
 */
export function getWIFFromPrivateKey(privateKey: string): string {
  return WIF.encode(128, Buffer.from(privateKey, "hex"), true);
}

/**
 * Converts a private key to public key.
 * @param privateKey
 * @param encode Returns the encoded form if true.
 */
export function getPublicKeyFromPrivateKey(
  privateKey: string,
  encode = true
): string {
  const privateKeyBuffer = Buffer.from(privateKey, "hex");
  const keypair = curve.keyFromPrivate(privateKeyBuffer, "hex");
  const unencodedPubKey = keypair.getPublic().encode("hex", false);
  if (encode) {
    const tail = parseInt(unencodedPubKey.substr(64 * 2, 2), 16);
    if (tail % 2 === 1) {
      return "03" + unencodedPubKey.substr(2, 64);
    } else {
      return "02" + unencodedPubKey.substr(2, 64);
    }
  } else {
    return unencodedPubKey;
  }
}

/**
 * Converts a public key to verification script form.
 * VerificationScript serves a very niche purpose.
 * It is attached as part of the signature when signing a transaction.
 * Thus, the name 'scriptHash' instead of 'keyHash' is because we are hashing the verificationScript and not the PublicKey.
 */
export const getVerificationScriptFromPublicKey = (
  publicKey: string
): string => {
  return "21" + publicKey + "ac";
};

/**
 * Converts a public key to scripthash.
 */
export const getScriptHashFromPublicKey = (publicKey: string): string => {
  // if unencoded
  if (publicKey.substring(0, 2) === "04") {
    publicKey = getPublicKeyEncoded(publicKey);
  }
  const verificationScript = getVerificationScriptFromPublicKey(publicKey);
  return reverseHex(hash160(verificationScript));
};

/**
 * Converts a scripthash to address.
 */
export const getAddressFromScriptHash = (scriptHash: string): string => {
  scriptHash = reverseHex(scriptHash);
  const shaChecksum = hash256(ADDR_VERSION + scriptHash).substr(0, 8);
  return base58.encode(
    Buffer.from(ADDR_VERSION + scriptHash + shaChecksum, "hex")
  );
};

/**
 * Converts an address to scripthash.
 */
export const getScriptHashFromAddress = (address: string): string => {
  const hash = ab2hexstring(base58.decode(address));
  return reverseHex(hash.substr(2, 40));
};

/**
 * Generates a signature of the transaction based on given private key.
 * @param tx Serialized unsigned transaction.
 * @param privateKey Private Key.
 * @return Signature. Does not include tx.
 */
export const generateSignature = (tx: string, privateKey: string): string => {
  return sign(tx, privateKey);
};

/**
 * Generates a random private key.
 */
export const generatePrivateKey = (): string => {
  return ab2hexstring(generateRandomArray(32));
};
