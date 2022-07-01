/**
 * Core methods for manipulating keys
 *
 * ```
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 * ```
 *
 * Keys are arranged in order of derivation.
 * Arrows determine the direction.
 *
 * NEP2 methods are found within NEP2 standard.
 * All methods take in Big-Endian strings and return Big-Endian strings.
 */
import base58 from "bs58";
import { Buffer } from "buffer";
import { DEFAULT_ADDRESS_VERSION } from "../consts";
import {
  ab2hexstring,
  hash160,
  hash256,
  hexstring2ab,
  reverseHex,
  generateRandomArray,
  getCurve,
  EllipticCurvePreset,
} from "../u";
import { OpCode, InteropServiceCode, ScriptBuilder, OpToken } from "../sc";

const curve = getCurve(EllipticCurvePreset.SECP256R1);
/**
 * Encodes a public key.
 * @param unencodedKey - unencoded public key
 * @returns encoded public key
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
 * @param publicKey - Encoded public key
 * @returns decoded public key
 */
export function getPublicKeyUnencoded(publicKey: string): string {
  return curve.decodePublicKey(publicKey);
}

/**
 * Converts a WIF to private key.
 */
export function getPrivateKeyFromWIF(wif: string): string {
  const assembledKeyWithChecksum = ab2hexstring(base58.decode(wif));
  return assembledKeyWithChecksum.substr(2, 64);
}

/**
 * Converts a private key to WIF.
 */
export function getWIFFromPrivateKey(privateKey: string): string {
  const assembledKey = "80" + privateKey + "01";
  const hashed = hash256(assembledKey);
  const checksum = hashed.substr(0, 8); // first 4 bytes
  const assembledKeyWithChecksum = assembledKey + checksum;
  return base58.encode(hexstring2ab(assembledKeyWithChecksum));
}

/**
 * Converts a private key to public key.
 * @param privateKey - 64 bit private key
 * @param encode - returns the encoded form if true.
 */
export function getPublicKeyFromPrivateKey(
  privateKey: string,
  encode = true
): string {
  return curve.getPublicKey(privateKey, encode);
}

/**
 * Converts a public key to verification script form.
 * VerificationScript serves a very niche purpose.
 * It is attached as part of the signature when signing a transaction.
 * Thus, the name 'scriptHash' instead of 'keyHash' is because we are hashing the verificationScript and not the PublicKey.
 */
export function getVerificationScriptFromPublicKey(publicKey: string): string {
  const sb = new ScriptBuilder();
  return sb
    .emit(OpCode.PUSHDATA1, "21" + publicKey)
    .emitSysCall(InteropServiceCode.SYSTEM_CRYPTO_CHECKSIG)
    .build();
}

/**
 * Extracts the public key from the verification script. This only works for single key accounts.
 * @param script - hexstring
 */
export function getPublicKeyFromVerificationScript(script: string): string {
  const ops = OpToken.fromScript(script);
  const sysCallToken = ops.pop();
  if (
    sysCallToken === undefined ||
    sysCallToken.code !== OpCode.SYSCALL ||
    (sysCallToken.params ?? "") !== InteropServiceCode.SYSTEM_CRYPTO_CHECKSIG
  ) {
    throw new Error("script is not a single key account.");
  }
  const publicKeyToken = ops[0];
  if (publicKeyToken.code !== OpCode.PUSHDATA1 || !publicKeyToken.params) {
    throw new Error("cannot find public key");
  }
  return publicKeyToken.params;
}

/**
 * Converts a verification script to scripthash.
 *
 * @param verificationScript - hexstring
 */
export function getScriptHashFromVerificationScript(
  verificationScript: string
): string {
  return reverseHex(hash160(verificationScript));
}

/**
 * Converts a public key to scripthash.
 */
export function getScriptHashFromPublicKey(publicKey: string): string {
  // if unencoded
  if (publicKey.substring(0, 2) === "04") {
    publicKey = getPublicKeyEncoded(publicKey);
  }
  const verificationScript = getVerificationScriptFromPublicKey(publicKey);
  return reverseHex(hash160(verificationScript));
}

/**
 * Converts a scripthash to address.
 */
export function getAddressFromScriptHash(
  scriptHash: string,
  addressVersion = DEFAULT_ADDRESS_VERSION
): string {
  scriptHash = reverseHex(scriptHash);
  const addressVersionHex = addressVersion.toString(16);
  const shaChecksum = hash256(addressVersionHex + scriptHash).substr(0, 8);
  return base58.encode(
    Buffer.from(addressVersionHex + scriptHash + shaChecksum, "hex")
  );
}

/**
 * Converts an address to scripthash.
 */
export function getScriptHashFromAddress(address: string): string {
  const hash = ab2hexstring(base58.decode(address));
  return reverseHex(hash.substr(2, 40));
}

/**
 * Generates a random private key.
 */
export function generatePrivateKey(): string {
  return ab2hexstring(generateRandomArray(32));
}

/**
 * Extracts the address version from a given correct NEO address.
 * @param address - A NEO address string.
 * @returns Address version
 */
export function getAddressVersion(address: string): number {
  return base58.decode(address)[0];
}
