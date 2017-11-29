import fs from 'fs'
import Account from './Account'
import { encrypt } from './nep2'
import { isNEP2 } from './verify'
import { DEFAULT_SCRYPT, DEFAULT_WALLET } from '../consts'

/**
 * @typedef WalletAccount
 * @param {string} address - Address of account.
 * @param {string} label - Label of account.
 * @param {boolean} isDefault - Is the default change account.
 * @param {boolean} lock - Is not allowed to spend funds.
 * @param {string} key - Encrypted WIF of account.
 * @param {object} contract - Contract details (applicable to contract address).
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
  constructor ({ name = 'myWallet', version = '1.0', scrypt = DEFAULT_SCRYPT, accounts = [], extra = null } = DEFAULT_WALLET) {
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
    if (index === 0) {
      this.accounts[0].isDefault = true
    }
    return index
  }

  /**
   * Adds a private key / WIF / encrypted key
   * @param {string} key - Private key / WIF / encrypted key. If unencrypted, a keyphrase is required.
   * @param {string} [keyphrase] - Keyphrase to encrypt the unencrypted key.
   * @return {number} Index position of Account in array.
   */
  addKey (key, keyphrase) {
    if (!isNEP2(key)) key = encrypt(key, keyphrase, this.scrypt)
    return this.addAccount(new Account())
  }

  /**
   * Attempts to decrypt all accounts with keyphrase.
   * @param {string} keyphrase
   * @return {boolean[]} Each boolean represents if that Account has been decrypted successfully.
   */
  decrypt (keyphrase) {
    const results = []
    for (const acct of this.accounts) {
      try {
        acct.decrypt(keyphrase, this.scrypt)
        results.push(true)
      } catch (e) {
        results.push(false)
      }
    }
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
