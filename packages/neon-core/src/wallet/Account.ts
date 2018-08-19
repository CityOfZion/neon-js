import util from "util";
import { DEFAULT_ACCOUNT_CONTRACT, DEFAULT_SCRYPT } from "../consts";
import logger from "../logging";
import * as core from "./core";
import { decrypt, encrypt, ScryptParams } from "./nep2";
import {
  isAddress,
  isNEP2,
  isPrivateKey,
  isPublicKey,
  isScriptHash,
  isWIF
} from "./verify";

const log = logger("wallet");

export interface AccountJSON {
  address: string;
  label: string;
  isDefault: boolean;
  lock: boolean;
  key: string;
  contract?: {
    script: string;
    parameters: Array<{ name: string; type: string }>;
    deployed: boolean;
  };
  extra?: { [key: string]: any };
}

/**
 * This allows for simple utilisation and manipulating of keys without need the long access methods.
 *
 * Key formats are derived from each other lazily and stored for future access.
 * If the previous key (one level higher) is not found, it will attempt to generate it or throw an Error if insufficient information was provided (eg. trying to generate private key when only address was given.)
 *
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 *
 * @param str WIF/ Private Key / Public Key / Address or a Wallet Account object.
 * @example
 * const acct = new Account("L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g");
 * acct.address; // "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
 */
export class Account {
  public extra: { [key: string]: any };
  public isDefault: boolean;
  public lock: boolean;
  public contract: {
    script: string;
    parameters: Array<{ name: string; type: string }>;
    deployed: boolean;
  };
  public label: string;

  // tslint:disable:variable-name
  private _privateKey?: string;
  private _encrypted?: string;
  private _address?: string;
  private _publicKey?: string;
  private _scriptHash?: string;
  private _WIF?: string;
  // tslint:enables:variable-name

  constructor(str: string | AccountJSON = "") {
    this.extra = {};
    this.label = "";
    this.isDefault = false;
    this.lock = false;
    this.contract = Object.assign({}, DEFAULT_ACCOUNT_CONTRACT);
    if (!str) {
      this._privateKey = core.generatePrivateKey();
    } else if (typeof str === "object") {
      this._encrypted = str.key;
      this._address = str.address;
      this.label = str.label || "";
      this.extra = str.extra || {};
      this.isDefault = str.isDefault || false;
      this.lock = str.lock || false;
      this.contract =
        str.contract || Object.assign({}, DEFAULT_ACCOUNT_CONTRACT);
    } else if (isPrivateKey(str)) {
      this._privateKey = str;
    } else if (isPublicKey(str, false)) {
      this._publicKey = core.getPublicKeyEncoded(str);
    } else if (isPublicKey(str, true)) {
      this._publicKey = str;
    } else if (isScriptHash(str)) {
      this._scriptHash = str;
    } else if (isAddress(str)) {
      this._address = str;
    } else if (isWIF(str)) {
      this._privateKey = core.getPrivateKeyFromWIF(str);
      this._WIF = str;
    } else if (isNEP2(str)) {
      this._encrypted = str;
    } else {
      throw new ReferenceError(`Invalid input: ${str}`);
    }

    // Attempts to make address the default label of the Account.
    if (!this.label) {
      try {
        this.label = this.address;
      } catch (err) {
        this.label = "";
      }
    }
    this._updateContractScript();
  }

  get [Symbol.toStringTag]() {
    return "Account";
  }

  public [util.inspect.custom]() {
    return `[Account: ${this.label}]`;
  }

  /**
   * Key encrypted according to NEP2 standard.
   */
  get encrypted() {
    if (this._encrypted) {
      return this._encrypted;
    } else {
      throw new Error("No encrypted key found");
    }
  }

  /**
   * Case sensitive key of 52 characters long.
   */
  get WIF() {
    if (this._WIF) {
      return this._WIF;
    } else {
      this._WIF = core.getWIFFromPrivateKey(this.privateKey);
      return this._WIF;
    }
  }

  /**
   * Key of 64 hex characters.
   */
  get privateKey() {
    if (this._privateKey) {
      return this._privateKey;
    } else if (this._WIF) {
      this._privateKey = core.getPrivateKeyFromWIF(this._WIF);
      return this._privateKey;
    } else if (this._encrypted) {
      throw new ReferenceError("Private Key encrypted!");
    } else {
      throw new ReferenceError("No Private Key provided!");
    }
  }

  /**
   * Returns the public key in encoded form. This is the form that is the short version (starts with 02 or 03). If you require the unencoded form, do use the publicKey method instead of this getter.
   */
  get publicKey() {
    if (this._publicKey) {
      return this._publicKey;
    } else {
      this._publicKey = core.getPublicKeyFromPrivateKey(this.privateKey);
      return this._publicKey;
    }
  }

  /** Retrieves the Public Key in encoded / unencoded form.
   * @param encoded Encoded or unencoded.
   */
  public getPublicKey(encoded: boolean = true): string {
    return encoded
      ? this.publicKey
      : core.getPublicKeyUnencoded(this.publicKey);
  }

  /**
   * Script hash of the key. This format is usually used in the code instead of address as this is a hexstring.
   */
  get scriptHash() {
    if (this._scriptHash) {
      return this._scriptHash;
    } else {
      if (this._address) {
        this._scriptHash = core.getScriptHashFromAddress(this.address);
        return this._scriptHash;
      } else {
        this._scriptHash = core.getScriptHashFromPublicKey(this.publicKey);
        return this._scriptHash;
      }
    }
  }

  /**
   * Public address used to receive transactions. Case sensitive.
   */
  get address() {
    if (this._address) {
      return this._address;
    } else {
      this._address = core.getAddressFromScriptHash(this.scriptHash);
      return this._address;
    }
  }

  /**
   * This is the safe way to get a key without it throwing an error.
   */
  public tryGet(
    keyType:
      | "WIF"
      | "privateKey"
      | "publicKey"
      | "encrypted"
      | "scriptHash"
      | "address"
  ): string {
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
   */
  public encrypt(
    keyphrase: string,
    scryptParams: ScryptParams = DEFAULT_SCRYPT
  ): Promise<this> {
    return Promise.resolve()
      .then(_ => encrypt(this.privateKey, keyphrase, scryptParams))
      .then(encrypted => {
        this._encrypted = encrypted;
        return this;
      });
  }

  /**
   * Decrypts the encrypted key and return the Account object.
   */
  public decrypt(
    keyphrase: string,
    scryptParams: ScryptParams = DEFAULT_SCRYPT
  ): Promise<this> {
    return Promise.resolve()
      .then(_ => decrypt(this.encrypted, keyphrase, scryptParams))
      .then(wif => {
        this._WIF = wif;
        this._updateContractScript();
        return this;
      });
  }

  /**
   * Export Account as a WalletAccount object.
   */
  public export(): AccountJSON {
    let key: string = "";
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

  public equals(other: AccountJSON): boolean {
    return this.address === other.address;
  }

  /**
   * Attempts to update the contract.script field if public key is available.
   */
  private _updateContractScript(): void {
    try {
      if (this.contract.script === "") {
        const publicKey = this.publicKey;
        this.contract.script = core.getVerificationScriptFromPublicKey(
          publicKey
        );
        log.debug(`Updated ContractScript for Account: ${this.label}`);
      }
    } catch (e) {
      return;
    }
  }
}

export default Account;
