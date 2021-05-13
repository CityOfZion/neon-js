/**
 * NEP2 - Private Key Encryption based on AES.
 * This encrypts your private key with a passphrase, protecting your private key from being stolen and used.
 * It is useful for storing private keys in a JSON file securely or to mask the key before printing it.
 */
import bs58check from "bs58check"; // This is importable because WIF specifies it as a dependency.
import AES from "crypto-js/aes";
import hexEncoding from "crypto-js/enc-hex";
import latin1Encoding from "crypto-js/enc-latin1";
import ECBMode from "crypto-js/mode-ecb";
import NoPadding from "crypto-js/pad-nopadding";
import SHA256 from "crypto-js/sha256";
import { lib } from "crypto-js";
import { scrypt } from "scrypt-js";
import { DEFAULT_SCRYPT, NEP_FLAG, NEP_HEADER } from "../consts";
import logging from "../logging";
import { ab2hexstring, hexXor } from "../u";
import Account from "./Account";

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

/**
 * Encrypts a WIF key using a given keyphrase under NEP-2 Standard.
 * @param wifKey WIF key to encrypt (52 chars long).
 * @param keyphrase The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param scryptParams Optional parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns The encrypted key in Base58 (Case sensitive).
 */
export async function encrypt(
  wifKey: string,
  keyphrase: string,
  scryptParams: ScryptParams = DEFAULT_SCRYPT
): Promise<string> {
  const { n, r, p } = scryptParams;
  const account = new Account(wifKey);
  // SHA Salt (use the first 4 bytes)
  const firstSha = SHA256(enc.Latin1.parse(account.address));
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
  const xor = hexXor(account.privateKey, derived1);
  const encrypted = AES.encrypt(
    enc.Hex.parse(xor),
    enc.Hex.parse(derived2),
    AES_OPTIONS
  );
  const assembled =
    NEP_HEADER + NEP_FLAG + addressHash + encrypted.ciphertext.toString();
  const encryptedKey = bs58check.encode(Buffer.from(assembled, "hex"));
  log.info(`Successfully encrypted key to ${encryptedKey}`);
  return encryptedKey;
}

/**
 * Decrypts an encrypted key using a given keyphrase under NEP-2 Standard.
 * @param encryptedKey The encrypted key (58 chars long).
 * @param keyphrase The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param scryptParams Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns The decrypted WIF key.
 */
export async function decrypt(
  encryptedKey: string,
  keyphrase: string,
  scryptParams: ScryptParams = DEFAULT_SCRYPT
): Promise<string> {
  const { n, r, p } = scryptParams;
  const assembled = ab2hexstring(bs58check.decode(encryptedKey));
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
    AES_OPTIONS
  );
  const privateKey = hexXor(decrypted.toString(), derived1);
  const account = new Account(privateKey);
  const newAddressHash = SHA256(SHA256(enc.Latin1.parse(account.address)))
    .toString()
    .slice(0, 8);
  if (addressHash !== newAddressHash) {
    throw new Error("Wrong password or scrypt parameters!");
  }
  log.info(`Successfully decrypted ${encryptedKey}`);
  return account.WIF;
}
