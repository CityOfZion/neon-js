"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const consts_1 = require("../consts");
const logging_1 = __importDefault(require("../logging"));
const core = __importStar(require("./core"));
const nep2_1 = require("./nep2");
const verify_1 = require("./verify");
const log = logging_1.default("wallet");
/**
 * @class Account
 * @classdesc
 * This allows for simple utilisation and manipulating of keys without need the long access methods.
 * Key formats are derived from each other lazily and stored for future access.
 * If the previous key (one level higher) is not found, it will attempt to generate it or throw an Error if insufficient information was provided (eg. trying to generate private key when only address was given.)
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 * @param {string|object} str - WIF/ Private Key / Public Key / Address or a Wallet Account object.
 */
class Account {
    // tslint:enables:variable-name
    constructor(str = "") {
        this.extra = {};
        this.label = "";
        this.isDefault = false;
        this.lock = false;
        this.contract = Object.assign({}, consts_1.DEFAULT_ACCOUNT_CONTRACT);
        if (!str) {
            this._privateKey = core.generatePrivateKey();
        }
        else if (typeof str === "object") {
            this._encrypted = str.key;
            this._address = str.address;
            this.label = str.label || "";
            this.extra = str.extra || {};
            this.isDefault = str.isDefault || false;
            this.lock = str.lock || false;
            this.contract =
                str.contract || Object.assign({}, consts_1.DEFAULT_ACCOUNT_CONTRACT);
        }
        else if (verify_1.isPrivateKey(str)) {
            this._privateKey = str;
        }
        else if (verify_1.isPublicKey(str, false)) {
            this._publicKey = core.getPublicKeyEncoded(str);
        }
        else if (verify_1.isPublicKey(str, true)) {
            this._publicKey = str;
        }
        else if (verify_1.isScriptHash(str)) {
            this._scriptHash = str;
        }
        else if (verify_1.isAddress(str)) {
            this._address = str;
        }
        else if (verify_1.isWIF(str)) {
            this._privateKey = core.getPrivateKeyFromWIF(str);
            this._WIF = str;
        }
        else if (verify_1.isNEP2(str)) {
            this._encrypted = str;
        }
        else {
            throw new ReferenceError(`Invalid input: ${str}`);
        }
        // Attempts to make address the default label of the Account.
        if (!this.label) {
            try {
                this.label = this.address;
            }
            catch (err) {
                this.label = "";
            }
        }
        this._updateContractScript();
    }
    get [Symbol.toStringTag]() {
        return "Account";
    }
    [util_1.default.inspect.custom]() {
        return `[Account: ${this.label}]`;
    }
    /**
     * Key encrypted according to NEP2 standard.
     * @type {string}
     */
    get encrypted() {
        if (this._encrypted) {
            return this._encrypted;
        }
        else {
            throw new Error("No encrypted key found");
        }
    }
    /**
     * Case sensitive key of 52 characters long.
     * @type {string}
     */
    get WIF() {
        if (this._WIF) {
            return this._WIF;
        }
        else {
            this._WIF = core.getWIFFromPrivateKey(this.privateKey);
            return this._WIF;
        }
    }
    /**
     * Key of 64 hex characters.
     * @type {string}
     */
    get privateKey() {
        if (this._privateKey) {
            return this._privateKey;
        }
        else if (this._WIF) {
            this._privateKey = core.getPrivateKeyFromWIF(this._WIF);
            return this._privateKey;
        }
        else if (this._encrypted) {
            throw new ReferenceError("Private Key encrypted!");
        }
        else {
            throw new ReferenceError("No Private Key provided!");
        }
    }
    /**
     * Returns the public key in encoded form. This is the form that is the short version (starts with 02 or 03). If you require the unencoded form, do use the publicKey method instead of this getter.
     * @type {string}
     */
    get publicKey() {
        if (this._publicKey) {
            return this._publicKey;
        }
        else {
            this._publicKey = core.getPublicKeyFromPrivateKey(this.privateKey);
            return this._publicKey;
        }
    }
    /** Retrieves the Public Key in encoded / unencoded form.
     * @param {boolean} encoded - Encoded or unencoded.
     * @return {string}
     */
    getPublicKey(encoded = true) {
        return encoded
            ? this.publicKey
            : core.getPublicKeyUnencoded(this.publicKey);
    }
    /**
     * Script hash of the key. This format is usually used in the code instead of address as this is a non case sensitive version.
     * @type {string}
     */
    get scriptHash() {
        if (this._scriptHash) {
            return this._scriptHash;
        }
        else {
            if (this._address) {
                this._scriptHash = core.getScriptHashFromAddress(this.address);
                return this._scriptHash;
            }
            else {
                this._scriptHash = core.getScriptHashFromPublicKey(this.publicKey);
                return this._scriptHash;
            }
        }
    }
    /**
     * Public address used to receive transactions. Case sensitive.
     * @type {string}
     */
    get address() {
        if (this._address) {
            return this._address;
        }
        else {
            this._address = core.getAddressFromScriptHash(this.scriptHash);
            return this._address;
        }
    }
    /**
     * This is the safe way to get a key without it throwing an error.
     */
    tryGet(keyType) {
        switch (keyType) {
            case "encrypted":
                return this._encrypted || "";
            case "WIF":
                return this._WIF || "";
            case "privateKey":
                return this._privateKey || "";
            case "publicKey":
                return this._publicKey || "";
            case "scriptHash":
                return this._scriptHash || "";
            case "address":
                return this._address || "";
        }
    }
    /**
     * Encrypts the current privateKey and return the Account object.
     * @param {string} keyphrase
     * @param {object} [scryptParams]
     * @return {Promise<Account>} this
     */
    encrypt(keyphrase, scryptParams = consts_1.DEFAULT_SCRYPT) {
        return Promise.resolve()
            .then(_ => nep2_1.encrypt(this.privateKey, keyphrase, scryptParams))
            .then(encrypted => {
            this._encrypted = encrypted;
            return this;
        });
    }
    /**
     * Decrypts the encrypted key and return the Account object.
     * @param {string} keyphrase
     * @param {object} [scryptParams]
     * @return {Promise<Account>} this
     */
    decrypt(keyphrase, scryptParams = consts_1.DEFAULT_SCRYPT) {
        return Promise.resolve()
            .then(_ => nep2_1.decrypt(this.encrypted, keyphrase, scryptParams))
            .then(wif => {
            this._WIF = wif;
            this._updateContractScript();
            return this;
        });
    }
    /**
     * Export Account as a WalletAccount object.
     */
    export() {
        let key = "";
        if (this._privateKey && !this._encrypted) {
            throw new Error("Encrypt private key first!");
        }
        if (this._encrypted) {
            key = this._encrypted;
        }
        return {
            address: this.address,
            label: this.label,
            isDefault: this.isDefault,
            lock: this.lock,
            key,
            contract: this.contract,
            extra: this.extra
        };
    }
    equals(other) {
        return this.address === other.address;
    }
    /**
     * Attempts to update the contract.script field if public key is available.
     */
    _updateContractScript() {
        try {
            if (this.contract.script === "") {
                const publicKey = this.publicKey;
                this.contract.script = core.getVerificationScriptFromPublicKey(publicKey);
                log.debug(`Updated ContractScript for Account: ${this.label}`);
            }
        }
        catch (e) {
            return;
        }
    }
}
exports.Account = Account;
exports.default = Account;
//# sourceMappingURL=Account.js.map