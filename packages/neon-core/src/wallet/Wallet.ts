import { DEFAULT_SCRYPT, DEFAULT_WALLET } from "../consts";
import logger from "../logging";
import { Account, AccountJSON } from "./Account";
import { ScryptParams } from "./nep2";

const log = logger("wallet");

export interface WalletJSON {
  name: string;
  version: string;
  scrypt: ScryptParams;
  accounts: AccountJSON[];
  extra: { [key: string]: any } | null;
}

/**
 * File to store private keys according to the NEP-2 specification.
 */
export class Wallet {
  public name: string;
  public version: string;
  public scrypt: ScryptParams;
  public accounts: Account[];
  public extra: { [key: string]: any };

  constructor(obj: Partial<WalletJSON> = DEFAULT_WALLET) {
    this.name = obj.name || "myWallet";
    this.version = obj.version || DEFAULT_WALLET.version;
    this.scrypt = Object.assign({}, DEFAULT_SCRYPT, obj.scrypt);
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
  get defaultAccount(): Account {
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
   * @param acct Account or WalletAccount object.
   * @return Index position of Account in array.
   */
  public addAccount(acct: Account | AccountJSON): number {
    const index = this.accounts.length;
    if (!(acct instanceof Account)) {
      acct = new Account(acct);
    }
    this.accounts.push(acct);
    try {
      const address = acct.address;
      log.info(`Added Account: ${address} to Wallet ${this.name}`);
    } catch (err) {
      log.warn(
        `Encrypted account added to Wallet ${
          this.name
        }. You will not be able to export this wallet without first decrypting this account`
      );
    }
    return index;
  }

  /**
   * Attempts to decrypt Account at index in array.
   * @param index Index of Account in array.
   * @param keyphrase keyphrase
   * @return Decryption success/failure
   */
  public decrypt(index: number, keyphrase: string): boolean {
    if (index < 0) {
      throw new Error("Index cannot be negative!");
    }
    if (index >= this.accounts.length) {
      throw new Error("Index cannot larger than Accounts array!");
    }
    try {
      this.accounts[index].decrypt(keyphrase, this.scrypt);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Attempts to decrypt all accounts with keyphrase.
   * @param keyphrase
   * @return Each boolean represents if that Account has been decrypted successfully.
   */
  public decryptAll(keyphrase: string): boolean[] {
    const results: boolean[] = [];
    this.accounts.map((acct, i) => {
      results.push(this.decrypt(i, keyphrase));
    });
    log.info(
      `decryptAll for Wallet ${this.name}: ${results.reduce((c, p) => {
        return p + (c ? "1" : "0");
      }, "")}`
    );
    return results;
  }

  /**
   * Attempts to encrypt Account at index in array.
   * @param index Index of Account in array.
   * @param keyphrase
   * @return Encryption success/failure
   */
  public encrypt(index: number, keyphrase: string): boolean {
    if (index < 0) {
      throw new Error("Index cannot be negative!");
    }
    if (index >= this.accounts.length) {
      throw new Error("Index cannot larger than Accounts array!");
    }
    try {
      this.accounts[index].encrypt(keyphrase, this.scrypt);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Attempts to encrypt all accounts with keyphrase.
   * @param keyphrase
   * @return Each boolean represents if that Account has been encrypted successfully.
   */
  public encryptAll(keyphrase: string): boolean[] {
    const results: boolean[] = [];
    this.accounts.map((acct, i) => {
      results.push(this.encrypt(i, keyphrase));
    });
    log.info(
      `decryptAll for Wallet ${this.name}: ${results.reduce((c, p) => {
        return p + (c ? "1" : "0");
      }, "")}`
    );
    return results;
  }

  /**
   * Export this class as a JS object.
   */
  public export(): WalletJSON {
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
   * @param index The index of the Account in accounts array.
   * @return this
   */
  public setDefault(index: number) {
    for (let i = 0; i < this.accounts.length; i++) {
      this.accounts[i].isDefault = i === index;
    }
    log.info(
      `Set Account: ${this.accounts[index]} as default for Wallet ${this.name}`
    );
  }
}

export default Wallet;
