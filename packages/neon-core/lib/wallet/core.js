"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file Core methods for manipulating keys
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 * Keys are arranged in order of derivation.
 * Arrows determine the direction.
 *
 * NEP2 methods are found within NEP2 standard.
 * All methods take in Big-Endian strings and return Big-Endian strings.
 */
const bs58_1 = __importDefault(require("bs58"));
const buffer_1 = require("buffer");
const wif_1 = __importDefault(require("wif"));
const consts_1 = require("../consts");
const u_1 = require("../u");
const random_1 = require("../u/random");
const signing_1 = require("./signing");
/**
 * Encodes a public key.
 * @param unencodedKey unencoded public key
 * @return encoded public key
 */
function getPublicKeyEncoded(unencodedKey) {
    const publicKeyArray = new Uint8Array(u_1.hexstring2ab(unencodedKey));
    if (publicKeyArray[64] % 2 === 1) {
        return "03" + u_1.ab2hexstring(publicKeyArray.slice(1, 33));
    }
    else {
        return "02" + u_1.ab2hexstring(publicKeyArray.slice(1, 33));
    }
}
exports.getPublicKeyEncoded = getPublicKeyEncoded;
/**
 * Unencodes a public key.
 * @param  publicKey Encoded public key
 * @return decoded public key
 */
function getPublicKeyUnencoded(publicKey) {
    const keyPair = signing_1.curve.keyFromPublic(publicKey, "hex");
    return keyPair.getPublic().encode("hex");
}
exports.getPublicKeyUnencoded = getPublicKeyUnencoded;
/**
 * Converts a WIF to private key.
 */
function getPrivateKeyFromWIF(wif) {
    return u_1.ab2hexstring(wif_1.default.decode(wif, 128).privateKey);
}
exports.getPrivateKeyFromWIF = getPrivateKeyFromWIF;
/**
 * Converts a private key to WIF.
 */
function getWIFFromPrivateKey(privateKey) {
    return wif_1.default.encode(128, buffer_1.Buffer.from(privateKey, "hex"), true);
}
exports.getWIFFromPrivateKey = getWIFFromPrivateKey;
/**
 * Converts a private key to public key.
 * @param privateKey
 * @param encode Returns the encoded form if true.
 */
function getPublicKeyFromPrivateKey(privateKey, encode = true) {
    const keypair = signing_1.curve.keyFromPrivate(privateKey, "hex");
    const unencodedPubKey = keypair.getPublic().encode("hex");
    if (encode) {
        const tail = parseInt(unencodedPubKey.substr(64 * 2, 2), 16);
        if (tail % 2 === 1) {
            return "03" + unencodedPubKey.substr(2, 64);
        }
        else {
            return "02" + unencodedPubKey.substr(2, 64);
        }
    }
    else {
        return unencodedPubKey;
    }
}
exports.getPublicKeyFromPrivateKey = getPublicKeyFromPrivateKey;
/**
 * Converts a public key to verification script form.
 * VerificationScript serves a very niche purpose.
 * It is attached as part of the signature when signing a transaction.
 * Thus, the name 'scriptHash' instead of 'keyHash' is because we are hashing the verificationScript and not the PublicKey.
 */
exports.getVerificationScriptFromPublicKey = (publicKey) => {
    return "21" + publicKey + "ac";
};
/**
 * Converts a public key to scripthash.
 */
exports.getScriptHashFromPublicKey = (publicKey) => {
    // if unencoded
    if (publicKey.substring(0, 2) === "04") {
        publicKey = getPublicKeyEncoded(publicKey);
    }
    const verificationScript = exports.getVerificationScriptFromPublicKey(publicKey);
    return u_1.reverseHex(u_1.hash160(verificationScript));
};
/**
 * Converts a scripthash to address.
 */
exports.getAddressFromScriptHash = (scriptHash) => {
    scriptHash = u_1.reverseHex(scriptHash);
    const shaChecksum = u_1.hash256(consts_1.ADDR_VERSION + scriptHash).substr(0, 8);
    return bs58_1.default.encode(buffer_1.Buffer.from(consts_1.ADDR_VERSION + scriptHash + shaChecksum, "hex"));
};
/**
 * Converts an address to scripthash.
 */
exports.getScriptHashFromAddress = (address) => {
    const hash = u_1.ab2hexstring(bs58_1.default.decode(address));
    return u_1.reverseHex(hash.substr(2, 40));
};
/**
 * Generates a signature of the transaction based on given private key.
 * @param tx Serialized unsigned transaction.
 * @param privateKey Private Key.
 * @return Signature. Does not include tx.
 */
exports.generateSignature = (tx, privateKey) => {
    return signing_1.sign(tx, privateKey);
};
/**
 * Generates a random private key.
 */
exports.generatePrivateKey = () => {
    return u_1.ab2hexstring(random_1.generateRandomArray(32));
};
//# sourceMappingURL=core.js.map