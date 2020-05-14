/**
 * Verification methods on the various key formats.
 * Useful for identification and ensuring key is valid.
 *
 * Methods are named as is<Format> where:
 * <Format> is the key format to check.
 *
 * All methods take in Big-Endian strings and return boolean.
 */

import base58 from "bs58";
import { ab2hexstring, hash256, isHex, reverseHex } from "../u";
import {
  getAddressFromScriptHash,
  getPublicKeyEncoded,
  getPublicKeyUnencoded,
} from "./core";

/**
 * Verifies a NEP2. This merely verifies the format. It is unable to verify if it is has been tampered with.
 */
export function isNEP2(nep2: string): boolean {
  try {
    if (nep2.length !== 58) {
      return false;
    }
    const hexStr = ab2hexstring(base58.decode(nep2));
    if (!hexStr || hexStr.length !== 86) {
      return false;
    }
    if (hexStr.substr(0, 2) !== "01") {
      return false;
    }
    if (hexStr.substr(2, 2) !== "42") {
      return false;
    }
    if (hexStr.substr(4, 2) !== "e0") {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Verifies a WIF using its checksum.
 */
export function isWIF(wif: string): boolean {
  try {
    if (wif.length !== 52) {
      return false;
    }
    const hexStr = ab2hexstring(base58.decode(wif));
    const shaChecksum = hash256(hexStr.substr(0, hexStr.length - 8)).substr(
      0,
      8
    );
    return shaChecksum === hexStr.substr(hexStr.length - 8, 8);
  } catch (e) {
    return false;
  }
}

/**
 * Checks if hexstring is a valid Private Key. Any hexstring of 64 chars is a valid private key.
 */
export function isPrivateKey(key: string): boolean {
  return /^[0-9A-Fa-f]{64}$/.test(key);
}

/**
 * Checks if hexstring is a valid Public Key. Accepts both encoded and unencoded forms.
 * @param key
 * @param  encoded Optional parameter to specify for a specific form. If this is omitted, this function will return true for both forms. If this parameter is provided, this function will only return true for the specific form.
 */
export function isPublicKey(key: string, encoded?: boolean): boolean {
  try {
    let encodedKey;
    switch (key.substr(0, 2)) {
      case "04":
        if (encoded === true) {
          return false;
        }
        // Encode key
        encodedKey = getPublicKeyEncoded(key);
        break;
      case "02":
      case "03":
        if (encoded === false) {
          return false;
        }
        encodedKey = key;
        break;
      default:
        return false;
    }
    const unencoded = getPublicKeyUnencoded(encodedKey);
    const tail = parseInt(unencoded.substr(unencoded.length - 2, 2), 16);
    if (encodedKey.substr(0, 2) === "02" && tail % 2 === 0) {
      return true;
    }
    if (encodedKey.substr(0, 2) === "03" && tail % 2 === 1) {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Verifies if string is a scripthash. Any 20 byte hexstring is a valid scriptHash.
 */
export function isScriptHash(scriptHash: string): boolean {
  return isHex(scriptHash) && scriptHash.length === 40;
}

/**
 * Verifies an address using its checksum.
 */
export function isAddress(address: string): boolean {
  try {
    const programHash = ab2hexstring(base58.decode(address));
    const shaChecksum = hash256(programHash.slice(0, 42)).substr(0, 8);
    // We use the checksum to verify the address
    if (shaChecksum !== programHash.substr(42, 8)) {
      return false;
    }
    // As other chains use similar checksum methods, we need to attempt to transform the programHash back into the address
    const scriptHash = reverseHex(programHash.slice(2, 42));
    if (getAddressFromScriptHash(scriptHash) !== address) {
      // address is not valid Neo address, could be btc, ltc etc.
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}
