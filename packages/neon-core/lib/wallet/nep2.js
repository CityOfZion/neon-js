"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * NEP2 - Private Key Encryption based on AES.
 * This encrypts your private key with a passphrase, protecting your private key from being stolen and used.
 * It is useful for storing private keys in a JSON file securely or to mask the key before printing it.
 */
const bs58check_1 = __importDefault(require("bs58check")); // This is importable because WIF specifies it as a dependency.
const aes_1 = __importDefault(require("crypto-js/aes"));
const enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
const enc_latin1_1 = __importDefault(require("crypto-js/enc-latin1"));
const mode_ecb_1 = __importDefault(require("crypto-js/mode-ecb"));
const pad_nopadding_1 = __importDefault(require("crypto-js/pad-nopadding"));
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const scrypt_js_1 = __importDefault(require("scrypt-js"));
const consts_1 = require("../consts");
const logging_1 = __importDefault(require("../logging"));
const u_1 = require("../u");
const Account_1 = __importDefault(require("./Account"));
const enc = {
    Latin1: enc_latin1_1.default,
    Hex: enc_hex_1.default
};
const AES_OPTIONS = { mode: mode_ecb_1.default, padding: pad_nopadding_1.default };
const log = logging_1.default("wallet");
/**
 * Encrypts a WIF key using a given keyphrase under NEP-2 Standard.
 * @param {string} wifKey - WIF key to encrypt (52 chars long).
 * @param {string} keyphrase - The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param {scryptParams} [scryptParams] - Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns {Promise<string>} The encrypted key in Base58 (Case sensitive).
 */
function encrypt(wifKey, keyphrase, scryptParams = consts_1.DEFAULT_SCRYPT) {
    return new Promise((resolve, reject) => {
        const { n, r, p } = scryptParams;
        const account = new Account_1.default(wifKey);
        // SHA Salt (use the first 4 bytes)
        const firstSha = sha256_1.default(enc.Latin1.parse(account.address));
        const addressHash = sha256_1.default(firstSha)
            .toString()
            .slice(0, 8);
        scrypt_js_1.default(Buffer.from(keyphrase.normalize("NFC"), "utf8"), Buffer.from(addressHash, "hex"), n, r, p, 64, (error, _, key) => {
            if (error != null) {
                reject(error);
            }
            else if (key) {
                const derived = Buffer.from(key).toString("hex");
                const derived1 = derived.slice(0, 64);
                const derived2 = derived.slice(64);
                // AES Encrypt
                const xor = u_1.hexXor(account.privateKey, derived1);
                const encrypted = aes_1.default.encrypt(enc.Hex.parse(xor), enc.Hex.parse(derived2), AES_OPTIONS);
                const assembled = consts_1.NEP_HEADER +
                    consts_1.NEP_FLAG +
                    addressHash +
                    encrypted.ciphertext.toString();
                const encryptedKey = bs58check_1.default.encode(Buffer.from(assembled, "hex"));
                log.info(`Successfully encrypted key to ${encryptedKey}`);
                resolve(encryptedKey);
            }
        });
    });
}
exports.encrypt = encrypt;
/**
 * Decrypts an encrypted key using a given keyphrase under NEP-2 Standard.
 * @param encryptedKey The encrypted key (58 chars long).
 * @param keyphrase The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param scryptParams Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns The decrypted WIF key.
 */
function decrypt(encryptedKey, keyphrase, scryptParams = consts_1.DEFAULT_SCRYPT) {
    return new Promise((resolve, reject) => {
        const { n, r, p } = scryptParams;
        const assembled = u_1.ab2hexstring(bs58check_1.default.decode(encryptedKey));
        const addressHash = assembled.substr(6, 8);
        const encrypted = assembled.substr(-64);
        scrypt_js_1.default(Buffer.from(keyphrase.normalize("NFC"), "utf8"), Buffer.from(addressHash, "hex"), n, r, p, 64, (error, _, key) => {
            if (error != null) {
                reject(error);
            }
            else if (key) {
                const derived = Buffer.from(key).toString("hex");
                const derived1 = derived.slice(0, 64);
                const derived2 = derived.slice(64);
                const ciphertext = {
                    ciphertext: enc.Hex.parse(encrypted),
                    salt: "",
                    iv: ""
                };
                const decrypted = aes_1.default.decrypt(ciphertext, enc.Hex.parse(derived2), AES_OPTIONS);
                const privateKey = u_1.hexXor(decrypted.toString(), derived1);
                const account = new Account_1.default(privateKey);
                const newAddressHash = sha256_1.default(sha256_1.default(enc.Latin1.parse(account.address)))
                    .toString()
                    .slice(0, 8);
                if (addressHash !== newAddressHash) {
                    reject(new Error("Wrong Password or scrypt parameters!"));
                }
                log.info(`Successfully decrypted ${encryptedKey}`);
                resolve(account.WIF);
            }
        });
    });
}
exports.decrypt = decrypt;
//# sourceMappingURL=nep2.js.map