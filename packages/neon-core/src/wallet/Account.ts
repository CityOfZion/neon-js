import util from "util";
import { DEFAULT_ACCOUNT_CONTRACT, DEFAULT_SCRYPT } from "../consts";
import logger from "../logging";
import { hash160, reverseHex } from "../u";
import * as core from "./core";
import { constructMultiSigVerificationScript } from "./multisig";
import { decrypt, encrypt, ScryptParams } from "./nep2";
import {
  isAddress,
  isNEP2,
  isPrivateKey,
  isPublicKey,
  isScriptHash,
  isWIF,
} from "./verify";

const log = logger("wallet");

const inspect = util.inspect.custom;
export interface AccountJSON {
  address: string;
  label: string;
  isDefault: boolean;
  lock: boolean;
  key: string;
  contract?: {
    script: string;
    parameters: { name: string; type: string }[];
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
  /**
   * Create a multi-sig account from a list of public keys
   * @param signingThreshold Minimum number of signatures required for verification. Must be larger than 0 and less than number of keys provided.
   * @param publicKeys List of public keys to form the account. 2-16 keys allowed. Order is important.
   * @example
   * const threshold = 2;
   * const publicKeys = [
   * "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
   * "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
   * "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa"
   * ];
   * const acct = Account.createMultiSig(threshold, publicKeys);
   */
  public static createMultiSig(
    signingThreshold: number,
    publicKeys: string[]
  ): Account {
    const verificationScript = constructMultiSigVerificationScript(
      signingThreshold,
      publicKeys
    );
    return new Account({
      contract: {
        script: verificationScript,
        parameters: Array(signingThreshold).map((_, i) => ({
          name: `signature${i}`,
          type: "Signature",
        })),
        deployed: false,
      },
    });
  }

  public extra: { [key: string]: any };
  public isDefault: boolean;
  public lock: boolean;
  public contract: {
    script: string;
    parameters: { name: string; type: string }[];
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

  public constructor(str: string | Partial<AccountJSON> = "") {
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

    this._updateContractScript();
    // Attempts to make address the default label of the Account.
    if (!this.label) {
      try {
        this.label = this.address;
      } catch (err) {
        this.label = "";
      }
    }
  }

  public get [Symbol.toStringTag](): string {
    return "Account";
  }

  public [inspect](): string {
    return `[Account: ${this.label}]`;
  }

  public get isMultiSig(): boolean {
    return (this.contract !== null &&
      this.contract.script &&
      this.contract.script.slice(this.contract.script.length - 2) ===
        "ae") as boolean;
  }

  /**
   * Key encrypted according to NEP2 standard.
   * @example 6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF
   */
  public get encrypted(): string {
    if (this._encrypted) {
      return this._encrypted;
    } else {
      throw new Error("No encrypted key found");
    }
  }

  /**
   * Case sensitive key of 52 characters long.
   * @example L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g
   */
  public get WIF(): string {
    if (this._WIF) {
      return this._WIF;
    } else {
      this._WIF = core.getWIFFromPrivateKey(this.privateKey);
      return this._WIF;
    }
  }

  /**
   * Key of 64 hex characters.
   * @example 7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344
   */
  public get privateKey(): string {
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
   * @example 02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef
   */
  public get publicKey(): string {
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
  public getPublicKey(encoded = true): string {
    return encoded
      ? this.publicKey
      : core.getPublicKeyUnencoded(this.publicKey);
  }

  /**
   * Script hash of the key. This format is usually used in the code instead of address as this is a hexstring.
   */
  public get scriptHash(): string {
    if (this._scriptHash) {
      return this._scriptHash;
    } else {
      if (this._address) {
        this._scriptHash = core.getScriptHashFromAddress(this.address);
        return this._scriptHash;
      } else if (this.contract.script) {
        this._scriptHash = this._getScriptHashFromVerificationScript();
        return this._scriptHash;
      } else {
        this._scriptHash = core.getScriptHashFromPublicKey(this.publicKey);
        return this._scriptHash;
      }
    }
  }

  /**
   * Public address used to receive transactions. Case sensitive.
   * @example ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
   */
  public get address(): string {
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
      .then((_) => encrypt(this.privateKey, keyphrase, scryptParams))
      .then((encrypted) => {
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
      .then((_) => decrypt(this.encrypted, keyphrase, scryptParams))
      .then((wif) => {
        this._WIF = wif;
        this._updateContractScript();
        return this;
      });
  }

  /**
   * Export Account as a WalletAccount object.
   */
  public export(): AccountJSON {
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
      extra: this.extra,
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
        this.contract.script =
          core.getVerificationScriptFromPublicKey(publicKey);
        this._scriptHash = this._getScriptHashFromVerificationScript();
        log.debug(`Updated ContractScript for Account: ${this.address}`);
      }
    } catch (e) {
      return;
    }
  }

  private _getScriptHashFromVerificationScript(): string {
    return reverseHex(hash160(this.contract.script));
  }
}

export default Account;
