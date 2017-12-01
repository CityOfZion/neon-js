import fs from 'fs'
import Account from './Account'
import { DEFAULT_SCRYPT, DEFAULT_WALLET } from '../consts'

/**
 * @typedef WalletAccount
 * @param {string} address - Address of account.
 * @param {string} label - Label of account.
 * @param {boolean} isDefault - Is the default change account.
 * @param {boolean} lock - Is not allowed to spend funds.
 * @param {string} key - Encrypted WIF of account.
 * @param {object|null} contract - Contract details (applicable to contract address).
 * @param {object} extra - Any extra information.
 */

/**
 * Wallet file
 * @param {WalletConfig} config - Wallet file
 * @param {string} config.name - Name of wallet
 * @param {scryptParams} config.scrypt - Scrypt parameters
 * @param {WalletAccount[]} config.accounts - Accounts in wallet
 * @param {object} config.extra - Extra information of wallet.
 */
class Wallet {
  constructor ({ name = 'myWallet', version = DEFAULT_WALLET.version, scrypt = DEFAULT_SCRYPT, accounts = [], extra = null } = DEFAULT_WALLET) {
    /** @type {string} */
    this.name = name
    /** @type {string} */
    this.version = version
    /** @type {object} */
    this.scrypt = scrypt
    /** @type {Account[]} */
    this.accounts = []
    for (const acct of accounts) {
      this.addAccount(acct)
    }
    /** @type {object|null} */
    this.extra = extra
  }

  /**
   * Returns the default Account according to the following rules:
   * 1. First Account where isDefault is true.
   * 2. First Account with a decrypted private key.
   * 3. First Account with an encrypted private key.
   * 4. First Account in the array.
   * Throws error if no accounts available.
   * @return {Account} Account
   */
  get defaultAccount () {
    if (this.accounts.length === 0) throw new Error(`No accounts available in this Wallet!`)
    for (const acct of this.accounts) {
      if (acct.isDefault) return acct
    }
    for (const acct of this.accounts) {
      if (acct._privateKey || acct._WIF) return acct
    }
    for (const acct of this.accounts) {
      if (acct.encrypted) return acct
    }
    return this.accounts[0]
  }

  /**
   * Imports a Wallet through a JSON string
   * @param {string} - JSON string
   * @return {Wallet}
   */
  static import (jsonString) {
    const walletJson = JSON.parse(jsonString)
    return new Wallet(walletJson)
  }

  /**
  * Reads a Wallet file sync.
  * @param {string} filepath - Relative path from cwd
  * @return {Wallet}
  */
  static readFile (filepath) {
    return this.import(fs.readFileSync(filepath, 'utf8'))
  }

  /**
   * Adds an account.
   * @param {Account|object} acct - Account or WalletAccount object.
   * @return {number} Index position of Account in array.
   */
  addAccount (acct) {
    const index = this.accounts.length
    if (acct instanceof Account) {
      this.accounts.push(acct)
    } else {
      this.accounts.push(new Account(acct))
    }
    return index
  }

  /**
   * Attempts to decrypt Account at index in array.
   * @param {number} index - Index of Account in array.
   * @param {string} keyphrase - keyphrase
   * @return {boolean} Decryption success/failure
   */
  decrypt (index, keyphrase) {
    if (index < 0) throw new Error(`Index cannot be negative!`)
    if (index >= this.accounts.length) throw new Error(`Index cannot larger than Accounts array!`)
    try {
      this.accounts[index].decrypt(keyphrase, this.scrypt)
      return true
    } catch (err) { return false }
  }

  /**
   * Attempts to decrypt all accounts with keyphrase.
   * @param {string} keyphrase
   * @return {boolean[]} Each boolean represents if that Account has been decrypted successfully.
   */
  decryptAll (keyphrase) {
    const results = []
    this.accounts.map((acct, i) => {
      results.push(this.decrypt(i, keyphrase))
    })
    return results
  }

  /**
   * Attempts to encrypt Account at index in array.
   * @param {number} index - Index of Account in array.
   * @param {string} keyphrase - keyphrase
   * @return {boolean} Encryption success/failure
   */
  encrypt (index, keyphrase) {
    if (index < 0) throw new Error(`Index cannot be negative!`)
    if (index >= this.accounts.length) throw new Error(`Index cannot larger than Accounts array!`)
    try {
      this.accounts[index].encrypt(keyphrase, this.scrypt)
      return true
    } catch (err) { return false }
  }

  /**
   * Attempts to encrypt all accounts with keyphrase.
   * @param {string} keyphrase
   * @return {boolean[]} Each boolean represents if that Account has been encrypted successfully.
   */
  encryptAll (keyphrase) {
    const results = []
    this.accounts.map((acct, i) => {
      results.push(this.encrypt(i, keyphrase))
    })
    return results
  }

  /**
   * Export this class as a string
   * @return {string}
   */
  export () {
    return JSON.stringify({
      name: this.name,
      scrypt: this.scrypt,
      accounts: this.accounts.map((acct) => acct.export()),
      extra: this.extra
    })
  }

  /**
   * Set Account at index in array to be default account.
   * @param {number} index - The index of the Account in accounts array.
   * @return this
   */
  setDefault (index) {
    for (let i = 0; i < this.accounts.length; i++) {
      this.accounts[i].isDefault = i === index
    }
  }

  /**
   * Writes the Wallet file to a file.
   * @param {string} filepath
   * @return {Promise<boolean>} write success / failure
   */
  writeFile (filepath) {
    return fs.writeFile(filepath, this.export(), (err) => {
      if (err) throw err
      console.log(`Wallet file written!`)
      return true
    })
  }
}

export default Wallet
