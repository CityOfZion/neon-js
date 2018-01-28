import * as core from './core'
import { isPrivateKey, isPublicKey, isWIF, isAddress, isNEP2 } from './verify'
import { encrypt, decrypt } from './nep2'
import { DEFAULT_ACCOUNT_CONTRACT } from '../consts'
import util from 'util'
import logger from '../logging'

const log = logger('wallet')

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
  constructor (str) {
    this.extra = null
    this.isDefault = false
    this.lock = false
    this.contract = Object.assign({}, DEFAULT_ACCOUNT_CONTRACT)
    if (!str) {
      this._privateKey = core.generatePrivateKey()
    } else if (typeof str === 'object') {
      this._encrypted = str.key
      this._address = str.address
      this.label = str.label || ''
      this.extra = str.extra
      this.isDefault = str.isDefault || false
      this.lock = str.lock || false
      this.contract = str.contract || Object.assign({}, DEFAULT_ACCOUNT_CONTRACT)
    } else if (isPrivateKey(str)) {
      this._privateKey = str
    } else if (isPublicKey(str, false)) {
      this._publicKey = core.getPublicKeyEncoded(str)
    } else if (isPublicKey(str, true)) {
      this._publicKey = str
    } else if (isAddress(str)) {
      this._address = str
    } else if (isWIF(str)) {
      this._privateKey = core.getPrivateKeyFromWIF(str)
      this._WIF = str
    } else if (isNEP2(str)) {
      this._encrypted = str
    } else {
      throw new ReferenceError(`Invalid input: ${str}`)
    }

    // Attempts to make address the default label of the Account.
    if (!this.label) {
      try { this.label = this.address } catch (err) { this.label = '' }
    }
    this._updateContractScript()
  }

  /**
   * Attempts to update the contract.script field if public key is available.
   */
  _updateContractScript () {
    try {
      if (this.contract.script === '') {
        const publicKey = this.publicKey
        this.contract.script = core.getVerificationScriptFromPublicKey(publicKey)
        log.debug(`Updated ContractScript for Account: ${this.label}`)
      }
    } catch (e) { }
  }

  /**
   * Key encrypted according to NEP2 standard.
   * @type {string}
   */
  get encrypted () {
    if (this._encrypted) {
      return this._encrypted
    } else {
      throw new Error('No encrypted key found')
    }
  }

  /**
   * Case sensitive key of 52 characters long.
   * @type {string}
   */
  get WIF () {
    if (this._WIF) {
      return this._WIF
    } else {
      this._WIF = core.getWIFFromPrivateKey(this._privateKey)
      return this._WIF
    }
  }

  /**
   * Key of 64 hex characters.
   * @type {string}
   */
  get privateKey () {
    if (this._privateKey) {
      return this._privateKey
    } else if (this._WIF) {
      this._privateKey = core.getPrivateKeyFromWIF(this._WIF)
      return this._privateKey
    } else if (this._encrypted) {
      throw new ReferenceError('Private Key encrypted!')
    } else {
      throw new ReferenceError('No Private Key provided!')
    }
  }

  /**
   * Returns the public key in encoded form. This is the form that is the short version (starts with 02 or 03). If you require the unencoded form, do use the publicKey method instead of this getter.
   * @type {string}
   *  */
  get publicKey () {
    if (this._publicKey) {
      return this._publicKey
    } else {
      this._publicKey = core.getPublicKeyFromPrivateKey(this.privateKey)
      return this._publicKey
    }
  }

  /** Retrieves the Public Key in encoded / unencoded form.
   * @param {boolean} encoded - Encoded or unencoded.
   * @return {string}
   */
  getPublicKey (encoded = true) {
    if (encoded) return this.publicKey
    else {
      let encoded = this.publicKey
      return core.getPublicKeyUnencoded(encoded)
    }
  }

  /**
   * Script hash of the key. This format is usually used in the code instead of address as this is a non case sensitive version.
   * @type {string}
   */
  get scriptHash () {
    if (this._scriptHash) {
      return this._scriptHash
    } else {
      if (this._address) {
        this._scriptHash = core.getScriptHashFromAddress(this.address)
        return this._scriptHash
      } else {
        this._scriptHash = core.getScriptHashFromPublicKey(this.publicKey)
        return this._scriptHash
      }
    }
  }

  /**
   * Public address used to receive transactions. Case sensitive.
   * @type {string}
   */
  get address () {
    if (this._address) {
      return this._address
    } else {
      this._address = core.getAddressFromScriptHash(this.scriptHash)
      return this._address
    }
  }

  /**
   * Encrypts the current privateKey and return the Account object.
   * @param {string} keyphrase
   * @param {object} [scryptParams]
   * @return {Account} this
   */
  encrypt (keyphrase, scryptParams = undefined) {
    this._encrypted = encrypt(this.privateKey, keyphrase, scryptParams)
    return this
  }

  /**
   * Decrypts the encrypted key and return the Account object.
   * @param {string} keyphrase
   * @param {object} [scryptParams]
   * @return {Account} this
   */
  decrypt (keyphrase, scryptParams = undefined) {
    this._WIF = decrypt(this.encrypted, keyphrase, scryptParams)
    this._updateContractScript()
    return this
  }

  /**
   * Export Account as a WalletAccount object.
   * @return {WalletAccount}
   */
  export () {
    let key = null
    if (this._privateKey && !this._encrypted) throw new Error('Encrypt private key first!')
    if (this._encrypted) key = this._encrypted
    return {
      address: this.address,
      label: this.label,
      isDefault: this.isDefault,
      lock: this.lock,
      key,
      contract: this.contract,
      extra: this.extra
    }
  }

  [util.inspect.custom] (depth, opts) {
    return `[Account: ${this.label}]`
  }
}

export default Account
