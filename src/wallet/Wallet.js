import fs from 'fs'
import Account from './Account'
import { DEFAULT_WALLET } from '../consts'
import logger from '../logging'

const log = logger('wallet')

/**
 * @typedef WalletFile
 * @param {string} name
 * @param {WalletScryptParams} scrypt
 * @param {WalletAccount[]} accounts
 * @param {object} extra
 */
/**
 * @typedef WalletScryptParams
 * @param {number} n - Must be power of 2. 2^8 - 2^64
 * @param {number} r - 1 - 256
 * @param {number} p - 1 - 256
 */

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
 * Wallet class to read and integrate a Wallet file into the library. This class is responsible for ensuring that the Wallet File is read correctly and usable by the library.
 * @param {WalletFile} file - Wallet file
 * @param {string} file.name - Name of wallet
 * @param {WalletScryptParams} file.scrypt - Scrypt parameters
 * @param {WalletAccount[]} file.accounts - Accounts in wallet
 * @param {object} file.extra - Extra information of wallet.
 */
class Wallet {
  constructor ({ name = 'myWallet', version = DEFAULT_WALLET.version, scrypt = {}, accounts = [], extra = null } = DEFAULT_WALLET) {
    /** @type {string} */
    this.name = name
    /** @type {string} */
    this.version = version
    /** @type {ScryptParams} */
    this.scrypt = scrypt
    /** @type {Account[]} */
    this.accounts = []
    for (const acct of accounts) {
      this.addAccount(acct)
    }
    /** @type {object|null} */
    this.extra = extra

    log.info(`New Wallet created: ${this.name}`)
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
    if (this.accounts.length === 0) throw new Error('No accounts available in this Wallet!')
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
    log.info(`Importing wallet from file: ${filepath}`)
    return this.import(fs.readFileSync(filepath, 'utf8'))
  }

  /**
   * Adds an account.
   * @param {Account|WalletAccount} acct - Account or WalletAccount object.
   * @return {number} Index position of Account in array.
   */
  addAccount (acct) {
    const index = this.accounts.length
    if (!(acct instanceof Account)) {
      acct = new Account(acct)
    }
    this.accounts.push(acct)
    try {
      const address = acct.address
      log.info(`Added Account: ${address} to Wallet ${this.name}`)
    } catch (err) {
      log.warn(`Encrypted account added to Wallet ${this.name}. You will not be able to export this wallet without first decrypting this account`)
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
    if (index < 0) throw new Error('Index cannot be negative!')
    if (index >= this.accounts.length) throw new Error('Index cannot larger than Accounts array!')
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
    log.info(`decryptAll for Wallet ${this.name}: ${results.reduce((c, p) => { return p + (c ? '1' : '0') }, '')}`)
    return results
  }

  /**
   * Attempts to encrypt Account at index in array.
   * @param {number} index - Index of Account in array.
   * @param {string} keyphrase
   * @return {boolean} Encryption success/failure
   */
  encrypt (index, keyphrase) {
    if (index < 0) throw new Error('Index cannot be negative!')
    if (index >= this.accounts.length) throw new Error('Index cannot larger than Accounts array!')
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
    log.info(`decryptAll for Wallet ${this.name}: ${results.reduce((c, p) => { return p + (c ? '1' : '0') }, '')}`)
    return results
  }

  /**
   * Export this class as a string
   * @return {string}
   */
  export () {
    return JSON.stringify({
      name: this.name,
      version: this.version,
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
    log.info(`Set Account: ${this.accounts[index]} as default for Wallet ${this.name}`)
  }

  /**
   * Writes the Wallet file to a file.
   * @param {string} filepath
   * @return {Promise<boolean>} write success / failure
   */
  writeFile (filepath) {
    log.info(`Exporting wallet file to: ${filepath}`)
    return fs.writeFile(filepath, this.export(), (err) => {
      if (err) throw err
      console.log('Wallet file written!')
      return true
    })
  }
}

export default Wallet
