/**
 * NEP2 - Private Key Encryption based on AES.
 * This encrypts your private key with a passphrase, protecting your private key from being stolen and used.
 * It is useful for storing private keys in a JSON file securely or to mask the key before printing it.
 */
import AES from "crypto-js/aes";
import hexEncoding from "crypto-js/enc-hex";
import latin1Encoding from "crypto-js/enc-latin1";
import ECBMode from "crypto-js/mode-ecb";
import NoPadding from "crypto-js/pad-nopadding";
import SHA256 from "crypto-js/sha256";
import { lib } from "crypto-js";
import { scrypt } from "ethereum-cryptography/scrypt";
import {
  DEFAULT_ADDRESS_VERSION,
  DEFAULT_SCRYPT,
  NEP2_FLAG,
  NEP2_HEADER,
} from "../consts";
import logging from "../logging";
import { ab2hexstring, hexXor, hash160, hash256, hexstring2ab } from "../u";
import { isWIF } from "./verify";
import {
  getPrivateKeyFromWIF,
  getPublicKeyFromPrivateKey,
  getAddressFromScriptHash,
  getWIFFromPrivateKey,
  getScriptHashFromPublicKey,
} from "./core";
import base58 from "bs58";
import { Buffer } from "buffer";

const NEO2_ADDRESS_VERSION = "17";
const enc = {
  Latin1: latin1Encoding,
  Hex: hexEncoding,
};

export interface ScryptParams {
  n: number;
  r: number;
  p: number;
}

const AES_OPTIONS = { mode: ECBMode, padding: NoPadding };

const log = logging("wallet");

async function createNep2Key(
  prefix: string,
  privateKey: string,
  keyphrase: string,
  address: string,
  scryptParams: ScryptParams,
): Promise<string> {
  const { n, r, p } = scryptParams;
  // SHA Salt (use the first 4 bytes)
  const firstSha = SHA256(enc.Latin1.parse(address));
  const addressHash = SHA256(firstSha).toString().slice(0, 8);

  const key = await scrypt(
    Buffer.from(keyphrase.normalize("NFC"), "utf8"),
    Buffer.from(addressHash, "hex"),
    n,
    r,
    p,
    64,
    () => {} // eslint-disable-line
  );

  const derived = Buffer.from(key).toString("hex");
  const derived1 = derived.slice(0, 64);
  const derived2 = derived.slice(64);
  // AES Encrypt
  const xor = hexXor(privateKey, derived1);
  const encrypted = AES.encrypt(
    enc.Hex.parse(xor),
    enc.Hex.parse(derived2),
    AES_OPTIONS,
  );
  const assembled =
    NEP2_HEADER + NEP2_FLAG + addressHash + encrypted.ciphertext.toString();

  const checksum = hash256(assembled).substr(0, 8);
  const encryptedKey = base58.encode(hexstring2ab(assembled + checksum));
  log.info(`Successfully encrypted key to ${encryptedKey}`);
  return encryptedKey;
}

function getAddressFromPrivateKey(
  privateKey: string,
  addressVersion: number,
): string {
  return getAddressFromScriptHash(
    getScriptHashFromPublicKey(getPublicKeyFromPrivateKey(privateKey)),
    addressVersion,
  );
}

function getNeo2AddressFromPrivateKey(privateKey: string): string {
  const publicKey = getPublicKeyFromPrivateKey(privateKey, true);
  const verificationScript = "21" + publicKey + "ac";
  const scriptHash = hash160(verificationScript);
  const shaChecksum = hash256(NEO2_ADDRESS_VERSION + scriptHash).substr(0, 8);
  return base58.encode(
    Buffer.from(NEO2_ADDRESS_VERSION + scriptHash + shaChecksum, "hex"),
  );
}

/**
 * Encrypts a WIF key using a given keyphrase under NEP-2 Standard.
 * @param wifKey - WIF key to encrypt (52 chars long).
 * @param keyphrase - password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param scryptParams - optional parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns The encrypted key in Base58 (Case sensitive).
 */
export function encrypt(
  wifKey: string,
  keyphrase: string,
  scryptParams: ScryptParams = DEFAULT_SCRYPT,
  addressVersion = DEFAULT_ADDRESS_VERSION,
): Promise<string> {
  const privateKey = isWIF(wifKey) ? getPrivateKeyFromWIF(wifKey) : wifKey;
  const address = getAddressFromPrivateKey(privateKey, addressVersion);
  return createNep2Key(
    NEP2_HEADER + NEP2_FLAG,
    privateKey,
    keyphrase,
    address,
    scryptParams,
  );
}

async function decipherNep2Key(
  encryptedKey: string,
  keyphrase: string,
  generateAddress: (privatekey: string) => string,
  scryptParams: ScryptParams,
): Promise<string> {
  const { n, r, p } = scryptParams;
  const assembledWithChecksum = ab2hexstring(base58.decode(encryptedKey));
  const assembled = assembledWithChecksum.substr(
    0,
    assembledWithChecksum.length - 8,
  );
  const checksum = assembledWithChecksum.substr(-8);
  if (hash256(assembled).substr(0, 8) !== checksum) {
    throw new Error("Base58 checksum failed.");
  }

  const addressHash = assembled.substr(6, 8);
  const encrypted = assembled.substr(-64);

  const key = await scrypt(
    Buffer.from(keyphrase.normalize("NFC"), "utf8"),
    Buffer.from(addressHash, "hex"),
    n,
    r,
    p,
    64,
    () => {} // eslint-disable-line
  );
  const derived = Buffer.from(key).toString("hex");
  const derived1 = derived.slice(0, 64);
  const derived2 = derived.slice(64);
  const ciphertext = lib.CipherParams.create({
    ciphertext: enc.Hex.parse(encrypted),
  });
  const decrypted = AES.decrypt(
    ciphertext,
    enc.Hex.parse(derived2),
    AES_OPTIONS,
  );
  const privateKey = hexXor(decrypted.toString(), derived1);
  const address = generateAddress(privateKey);
  const newAddressHash = SHA256(SHA256(enc.Latin1.parse(address)))
    .toString()
    .slice(0, 8);
  if (addressHash !== newAddressHash) {
    throw new Error("Wrong password or scrypt parameters!");
  }
  log.info(`Successfully decrypted ${encryptedKey}`);
  return privateKey;
}

/**
 * Decrypts an encrypted key using a given keyphrase under NEP-2 Standard.
 * @param encryptedKey - tThe encrypted key (58 chars long).
 * @param keyphrase - the password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param scryptParams - parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns The decrypted WIF key.
 */
export async function decrypt(
  encryptedKey: string,
  keyphrase: string,
  scryptParams: ScryptParams = DEFAULT_SCRYPT,
  addressVersion = DEFAULT_ADDRESS_VERSION,
): Promise<string> {
  const privateKey = await decipherNep2Key(
    encryptedKey,
    keyphrase,
    (privateKey) => getAddressFromPrivateKey(privateKey, addressVersion),
    scryptParams,
  );
  return getWIFFromPrivateKey(privateKey);
}

export async function decryptNeo2(
  encryptedKey: string,
  keyphrase: string,
  scryptParams: ScryptParams = DEFAULT_SCRYPT,
): Promise<string> {
  const privateKey = await decipherNep2Key(
    encryptedKey,
    keyphrase,
    getNeo2AddressFromPrivateKey,
    scryptParams,
  );
  return getWIFFromPrivateKey(privateKey);
}
