"use strict";
/**
 * Verification methods on the various key formats.
 * Useful for identification and ensuring key is valid.
 *
 * Methods are named as is<Format> where:
 * <Format> is the key format to check.
 *
 * All methods take in Big-Endian strings and return boolean.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bs58_1 = __importDefault(require("bs58"));
const u_1 = require("../u");
const core_1 = require("./core");
/**
 * Verifies a NEP2. This merely verifies the format. It is unable to verify if it is has been tampered with.
 */
function isNEP2(nep2) {
    try {
        if (nep2.length !== 58) {
            return false;
        }
        const hexStr = u_1.ab2hexstring(bs58_1.default.decode(nep2));
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
    }
    catch (e) {
        return false;
    }
}
exports.isNEP2 = isNEP2;
/**
 * Verifies a WIF using its checksum.
 */
function isWIF(wif) {
    try {
        if (wif.length !== 52) {
            return false;
        }
        const hexStr = u_1.ab2hexstring(bs58_1.default.decode(wif));
        const shaChecksum = u_1.hash256(hexStr.substr(0, hexStr.length - 8)).substr(0, 8);
        return shaChecksum === hexStr.substr(hexStr.length - 8, 8);
    }
    catch (e) {
        return false;
    }
}
exports.isWIF = isWIF;
/**
 * Checks if hexstring is a valid Private Key. Any hexstring of 64 chars is a valid private key.
 */
function isPrivateKey(key) {
    return /^[0-9A-Fa-f]{64}$/.test(key);
}
exports.isPrivateKey = isPrivateKey;
/**
 * Checks if hexstring is a valid Public Key. Accepts both encoded and unencoded forms.
 * @param key
 * @param  encoded Optional parameter to specify for a specific form. If this is omitted, this function will return true for both forms. If this parameter is provided, this function will only return true for the specific form.
 */
function isPublicKey(key, encoded) {
    try {
        let encodedKey;
        switch (key.substr(0, 2)) {
            case "04":
                if (encoded === true) {
                    return false;
                }
                // Encode key
                encodedKey = core_1.getPublicKeyEncoded(key);
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
        const unencoded = core_1.getPublicKeyUnencoded(encodedKey);
        const tail = parseInt(unencoded.substr(unencoded.length - 2, 2), 16);
        if (encodedKey.substr(0, 2) === "02" && tail % 2 === 0) {
            return true;
        }
        if (encodedKey.substr(0, 2) === "03" && tail % 2 === 1) {
            return true;
        }
        return false;
    }
    catch (e) {
        return false;
    }
}
exports.isPublicKey = isPublicKey;
/**
 * Verifies if string is a scripthash.
 */
function isScriptHash(scriptHash) {
    return u_1.isHex(scriptHash) && scriptHash.length === 40;
}
exports.isScriptHash = isScriptHash;
/**
 * Verifies an address using its checksum.
 */
function isAddress(address) {
    try {
        const programHash = u_1.ab2hexstring(bs58_1.default.decode(address));
        const shaChecksum = u_1.hash256(programHash.slice(0, 42)).substr(0, 8);
        // We use the checksum to verify the address
        if (shaChecksum !== programHash.substr(42, 8)) {
            return false;
        }
        // As other chains use similar checksum methods, we need to attempt to transform the programHash back into the address
        const scriptHash = u_1.reverseHex(programHash.slice(2, 42));
        if (core_1.getAddressFromScriptHash(scriptHash) !== address) {
            // address is not valid Neo address, could be btc, ltc etc.
            return false;
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isAddress = isAddress;
//# sourceMappingURL=verify.js.map