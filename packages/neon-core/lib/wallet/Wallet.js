"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../consts");
const logging_1 = __importDefault(require("../logging"));
const Account_1 = require("./Account");
const log = logging_1.default("wallet");
class Wallet {
    constructor(obj = consts_1.DEFAULT_WALLET) {
        this.name = obj.name || "myWallet";
        this.version = obj.version || consts_1.DEFAULT_WALLET.version;
        this.scrypt = Object.assign({}, consts_1.DEFAULT_SCRYPT, obj.scrypt);
        this.accounts = [];
        if (obj.accounts) {
            for (const acct of obj.accounts) {
                this.addAccount(acct);
            }
        }
        this.extra = obj.extra || {};
        log.info(`New Wallet created: ${this.name}`);
    }
    get [Symbol.toStringTag]() {
        return "Wallet";
    }
    /**
     * Returns the default Account according to the following rules:
     * 1. First Account where isDefault is true.
     * 2. First Account with a decrypted private key.
     * 3. First Account with an encrypted private key.
     * 4. First Account in the array.
     * Throws error if no accounts available.
     */
    get defaultAccount() {
        if (this.accounts.length === 0) {
            throw new Error("No accounts available in this Wallet!");
        }
        for (const acct of this.accounts) {
            if (acct.isDefault) {
                return acct;
            }
        }
        for (const acct of this.accounts) {
            if (acct.tryGet("privateKey") || acct.tryGet("WIF")) {
                return acct;
            }
        }
        for (const acct of this.accounts) {
            if (acct.encrypted) {
                return acct;
            }
        }
        return this.accounts[0];
    }
    /**
     * Adds an account.
     * @param {Account|AccountJSON} acct - Account or WalletAccount object.
     * @return {number} Index position of Account in array.
     */
    addAccount(acct) {
        const index = this.accounts.length;
        if (!(acct instanceof Account_1.Account)) {
            acct = new Account_1.Account(acct);
        }
        this.accounts.push(acct);
        try {
            const address = acct.address;
            log.info(`Added Account: ${address} to Wallet ${this.name}`);
        }
        catch (err) {
            log.warn(`Encrypted account added to Wallet ${this.name}. You will not be able to export this wallet without first decrypting this account`);
        }
        return index;
    }
    /**
     * Attempts to decrypt Account at index in array.
     * @param {number} index - Index of Account in array.
     * @param {string} keyphrase - keyphrase
     * @return {boolean} Decryption success/failure
     */
    decrypt(index, keyphrase) {
        if (index < 0) {
            throw new Error("Index cannot be negative!");
        }
        if (index >= this.accounts.length) {
            throw new Error("Index cannot larger than Accounts array!");
        }
        try {
            this.accounts[index].decrypt(keyphrase, this.scrypt);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Attempts to decrypt all accounts with keyphrase.
     * @param {string} keyphrase
     * @return {boolean[]} Each boolean represents if that Account has been decrypted successfully.
     */
    decryptAll(keyphrase) {
        const results = [];
        this.accounts.map((acct, i) => {
            results.push(this.decrypt(i, keyphrase));
        });
        log.info(`decryptAll for Wallet ${this.name}: ${results.reduce((c, p) => {
            return p + (c ? "1" : "0");
        }, "")}`);
        return results;
    }
    /**
     * Attempts to encrypt Account at index in array.
     * @param {number} index - Index of Account in array.
     * @param {string} keyphrase
     * @return {boolean} Encryption success/failure
     */
    encrypt(index, keyphrase) {
        if (index < 0) {
            throw new Error("Index cannot be negative!");
        }
        if (index >= this.accounts.length) {
            throw new Error("Index cannot larger than Accounts array!");
        }
        try {
            this.accounts[index].encrypt(keyphrase, this.scrypt);
            return true;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Attempts to encrypt all accounts with keyphrase.
     * @param {string} keyphrase
     * @return {boolean[]} Each boolean represents if that Account has been encrypted successfully.
     */
    encryptAll(keyphrase) {
        const results = [];
        this.accounts.map((acct, i) => {
            results.push(this.encrypt(i, keyphrase));
        });
        log.info(`decryptAll for Wallet ${this.name}: ${results.reduce((c, p) => {
            return p + (c ? "1" : "0");
        }, "")}`);
        return results;
    }
    /**
     * Export this class as a object
     */
    export() {
        return {
            name: this.name,
            version: this.version,
            scrypt: this.scrypt,
            accounts: this.accounts.map(acct => acct.export()),
            extra: this.extra
        };
    }
    /**
     * Set Account at index in array to be default account.
     * @param {number} index - The index of the Account in accounts array.
     * @return this
     */
    setDefault(index) {
        for (let i = 0; i < this.accounts.length; i++) {
            this.accounts[i].isDefault = i === index;
        }
        log.info(`Set Account: ${this.accounts[index]} as default for Wallet ${this.name}`);
    }
}
exports.Wallet = Wallet;
exports.default = Wallet;
//# sourceMappingURL=Wallet.js.map