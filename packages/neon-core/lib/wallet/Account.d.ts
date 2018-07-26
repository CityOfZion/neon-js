import { ScryptParams } from "./nep2";
export interface AccountJSON {
    address: string;
    label: string;
    isDefault: boolean;
    lock: boolean;
    key: string;
    contract?: {
        script: string;
        parameters: Array<{
            name: string;
            type: string;
        }>;
        deployed: boolean;
    };
    extra?: {
        [key: string]: any;
    };
}
/**
 * @class Account
 * @classdesc
 * This allows for simple utilisation and manipulating of keys without need the long access methods.
 * Key formats are derived from each other lazily and stored for future access.
 * If the previous key (one level higher) is not found, it will attempt to generate it or throw an Error if insufficient information was provided (eg. trying to generate private key when only address was given.)
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 * @param {string|object} str - WIF/ Private Key / Public Key / Address or a Wallet Account object.
 */
export declare class Account {
    extra: {
        [key: string]: any;
    };
    isDefault: boolean;
    lock: boolean;
    contract: {
        script: string;
        parameters: Array<{
            name: string;
            type: string;
        }>;
        deployed: boolean;
    };
    label: string;
    private _privateKey?;
    private _encrypted?;
    private _address?;
    private _publicKey?;
    private _scriptHash?;
    private _WIF?;
    constructor(str?: string | AccountJSON);
    readonly [Symbol.toStringTag]: string;
    /**
     * Key encrypted according to NEP2 standard.
     * @type {string}
     */
    readonly encrypted: string;
    /**
     * Case sensitive key of 52 characters long.
     * @type {string}
     */
    readonly WIF: string;
    /**
     * Key of 64 hex characters.
     * @type {string}
     */
    readonly privateKey: string;
    /**
     * Returns the public key in encoded form. This is the form that is the short version (starts with 02 or 03). If you require the unencoded form, do use the publicKey method instead of this getter.
     * @type {string}
     */
    readonly publicKey: string;
    /** Retrieves the Public Key in encoded / unencoded form.
     * @param {boolean} encoded - Encoded or unencoded.
     * @return {string}
     */
    getPublicKey(encoded?: boolean): string;
    /**
     * Script hash of the key. This format is usually used in the code instead of address as this is a non case sensitive version.
     * @type {string}
     */
    readonly scriptHash: string;
    /**
     * Public address used to receive transactions. Case sensitive.
     * @type {string}
     */
    readonly address: string;
    /**
     * This is the safe way to get a key without it throwing an error.
     */
    tryGet(keyType: "WIF" | "privateKey" | "publicKey" | "encrypted" | "scriptHash" | "address"): string;
    /**
     * Encrypts the current privateKey and return the Account object.
     * @param {string} keyphrase
     * @param {object} [scryptParams]
     * @return {Promise<Account>} this
     */
    encrypt(keyphrase: string, scryptParams?: ScryptParams): Promise<Account>;
    /**
     * Decrypts the encrypted key and return the Account object.
     * @param {string} keyphrase
     * @param {object} [scryptParams]
     * @return {Promise<Account>} this
     */
    decrypt(keyphrase: string, scryptParams?: ScryptParams): Promise<Account>;
    /**
     * Export Account as a WalletAccount object.
     */
    export(): AccountJSON;
    equals(other: AccountJSON): boolean;
    /**
     * Attempts to update the contract.script field if public key is available.
     */
    private _updateContractScript;
}
export default Account;
//# sourceMappingURL=Account.d.ts.map