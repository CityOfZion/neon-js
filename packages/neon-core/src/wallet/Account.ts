import {
  DEFAULT_ADDRESS_VERSION,
  DEFAULT_ACCOUNT_CONTRACT,
  DEFAULT_SCRYPT,
} from "../consts";
import logger from "../logging";
import { hash160, HexString, remove0xPrefix, reverseHex } from "../u";
import { isMultisigContract } from "../sc";
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
import { NeonObject } from "../model";

const log = logger("wallet");

export enum KeyType {
  PrivateKey = "PrivateKey",
  PublicKeyUnencoded = "PublicKeyUnencoded",
  PublicKeyEncoded = "PublicKeyEncoded",
  ScriptHash = "ScriptHash",
  Address = "Address",
  WIF = "WIF",
  NEP2 = "NEP2",
  Unknown = "",
}

export interface AccountJSON {
  /** Base58 encoded string */
  address: string;
  label: string;
  isDefault: boolean;
  lock: boolean;
  /** NEP2 encoded string */
  key: string;
  contract?: {
    /** Base64 encoded string */
    script: string;
    parameters: { name: string; type: string }[];
    deployed: boolean;
  };
  extra?: unknown;
}

/**
 * This allows for simple utilisation and manipulating of keys without need the long access methods.
 *
 * Key formats are derived from each other lazily and stored for future access.
 * If the previous key (one level higher) is not found, it will attempt to generate it or throw an Error if insufficient information was provided (eg. trying to generate private key when only address was given.)
 *
 * ```
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 * ```
 *
 * @param str - WIF/ Private Key / Public Key / Address or a Wallet Account object.
 *
 * @example
 * const acct = new Account("L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g");
 * acct.address; // "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
 */
export class Account implements NeonObject<AccountJSON> {
  /**
   * Create a multi-sig account from a list of public keys
   * @param signingThreshold - Minimum number of signatures required for verification. Must be larger than 0 and less than number of keys provided.
   * @param publicKeys - list of public keys to form the account. 2-16 keys allowed. Order is important.
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
    publicKeys: string[],
  ): Account {
    const verificationScript = constructMultiSigVerificationScript(
      signingThreshold,
      publicKeys,
    );
    return new Account({
      contract: {
        script: HexString.fromHex(verificationScript).toBase64(),
        parameters: Array(signingThreshold).map((_, i) => ({
          name: `signature${i}`,
          type: "Signature",
        })),
        deployed: false,
      },
    });
  }

  public static validateKey(str: string): KeyType {
    switch (true) {
      case isPrivateKey(str):
        return KeyType.PrivateKey;
      case isPublicKey(str, false):
        return KeyType.PublicKeyUnencoded;
      case isPublicKey(str, true):
        return KeyType.PublicKeyEncoded;
      case isScriptHash(str):
        return KeyType.ScriptHash;
      case isAddress(str):
        return KeyType.Address;
      case isWIF(str):
        return KeyType.WIF;
      case isNEP2(str):
        return KeyType.NEP2;
      default:
        // returning empty string enables falsly checks
        return KeyType.Unknown;
    }
  }

  public isDefault: boolean;
  public lock: boolean;
  public contract: {
    script: string;
    parameters: { name: string; type: string }[];
    deployed: boolean;
  };
  public label: string;

  public addressVersion: number = DEFAULT_ADDRESS_VERSION;

  // tslint:disable:variable-name
  private _privateKey?: string;
  private _encrypted?: string;
  private _address?: string;
  private _publicKey?: string;
  private _scriptHash?: string;
  private _WIF?: string;
  // tslint:enables:variable-name

  public constructor(
    str: string | Partial<AccountJSON> = "",
    config = { addressVersion: 0 },
  ) {
    this.label = "";
    this.isDefault = false;
    this.lock = false;
    this.contract = Object.assign({}, DEFAULT_ACCOUNT_CONTRACT);

    if (config && config.addressVersion > 0) {
      this.addressVersion = config.addressVersion;
    }

    if (!str) {
      this._privateKey = core.generatePrivateKey();
    } else if (typeof str === "object") {
      this._encrypted = str.key;
      this._address = str.address;
      this.label = str.label ?? "";
      this.isDefault = str.isDefault ?? false;
      this.lock = str.lock ?? false;
      this.contract =
        str.contract ?? Object.assign({}, DEFAULT_ACCOUNT_CONTRACT);
    } else if (isPrivateKey(str)) {
      this._privateKey = str;
    } else if (isPublicKey(str, false)) {
      this._publicKey = core.getPublicKeyEncoded(str);
    } else if (isPublicKey(str, true)) {
      this._publicKey = str;
    } else if (isScriptHash(str)) {
      this._scriptHash = remove0xPrefix(str);
    } else if (isAddress(str)) {
      this._address = str;
      const addressVersionFromAddress = core.getAddressVersion(str);

      if (
        config.addressVersion > 0 &&
        config.addressVersion !== addressVersionFromAddress
      ) {
        throw new Error(
          `Uncompatible address versions! Address ${str} uses version ${addressVersionFromAddress} but config declares version ${config.addressVersion}`,
        );
      }
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
      } catch {
        this.label = "";
      }
    }
  }

  public get [Symbol.toStringTag](): string {
    return "Account";
  }

  public get isMultiSig(): boolean {
    return isMultisigContract(HexString.fromBase64(this.contract?.script));
  }

  /**
   * Key encrypted according to NEP2 standard.
   *
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
   *
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
   *
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
   * Returns the public key in encoded form. This is the form that is the short version (starts with 02 or 03).
   * If you require the unencoded form, do use the publicKey method instead of this getter.
   *
   * @remarks
   * There are 2 sources of data: The verification script or the private key.
   * We attempt to rely on the verification script first if possible as that does not require decrypting the private key.
   * If it fails, then we rely on the private key and only throw if the private key is not available for conversion.
   *
   * @example 02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef
   */
  public get publicKey(): string {
    if (this._publicKey) {
      return this._publicKey;
    }
    if (this.contract?.script) {
      // Disassemble and attempt to pull the public key
      try {
        const verificationScript = HexString.fromBase64(
          this.contract.script,
        ).toBigEndian();
        this._publicKey =
          core.getPublicKeyFromVerificationScript(verificationScript);
        return this._publicKey;
      } catch {
        // Failed to get public key from contract. Account might be malformed.
      }
    }
    this._publicKey = core.getPublicKeyFromPrivateKey(this.privateKey);
    return this._publicKey;
  }

  /** Retrieves the Public Key in encoded / unencoded form.
   *
   * @param encoded - Encoded or unencoded.
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
      this._address = core.getAddressFromScriptHash(
        this.scriptHash,
        this.addressVersion,
      );
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
      | "address",
  ): string {
    switch (keyType) {
      case "encrypted":
        return this._encrypted ?? "";
      case "WIF":
        return this._WIF ?? "";
      case "privateKey":
        return this._privateKey ?? "";
      case "publicKey":
        return this._publicKey ?? "";
      case "scriptHash":
        return this._scriptHash ?? "";
      case "address":
        return this._address ?? "";
    }
  }

  /**
   * Encrypts the current privateKey and return the Account object.
   */
  public async encrypt(
    keyphrase: string,
    scryptParams: ScryptParams = DEFAULT_SCRYPT,
  ): Promise<this> {
    this._encrypted = await encrypt(this.privateKey, keyphrase, scryptParams);
    return this;
  }

  /**
   * Decrypts the encrypted key and return the Account object.
   */
  public async decrypt(
    keyphrase: string,
    scryptParams: ScryptParams = DEFAULT_SCRYPT,
  ): Promise<this> {
    this._WIF = await decrypt(this.encrypted, keyphrase, scryptParams);
    this._updateContractScript();
    return this;
  }

  /**
   * Export Account as a WalletAccount object.
   */
  public export(): AccountJSON {
    if (this._privateKey && !this._encrypted) {
      throw new Error("Encrypt private key first!");
    }
    const key = this._encrypted ?? "";
    return {
      address: this.address,
      label: this.label,
      isDefault: this.isDefault,
      lock: this.lock,
      key,
      contract: this.contract,
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
        this.contract.script = HexString.fromHex(
          core.getVerificationScriptFromPublicKey(publicKey),
        ).toBase64();
        this._scriptHash = this._getScriptHashFromVerificationScript();
        log.debug(`Updated ContractScript for Account: ${this.address}`);
      }
    } catch {
      return;
    }
  }

  private _getScriptHashFromVerificationScript(): string {
    const hexScript = HexString.fromBase64(this.contract.script).toBigEndian();
    return reverseHex(hash160(hexScript));
  }
}

export default Account;
