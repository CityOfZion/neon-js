import * as core from './core'
import { isPrivateKey, isPublicKey, isWIF, isAddress, isNEP2 } from './verify'
import { encrypt, decrypt } from './nep2'

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
    this.contract = null
    if (!str) {
      this._privateKey = core.generatePrivateKey()
    } else if (typeof str === 'object') {
      this._encrypted = str.key
      this._address = str.address
      this.label = str.label
      this.extra = str.extra
      this.isDefault = str.isDefault
      this.lock = str.lock
      this.contract = str.contract
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
  }

  /** @type {string} */
  get encrypted () {
    if (this._encrypted) {
      return this._encrypted
    } else {
      throw new Error(`No encrypted key found`)
    }
  }

  /** @type {string} */
  get WIF () {
    if (this._WIF) {
      return this._WIF
    } else {
      this._WIF = core.getWIFFromPrivateKey(this._privateKey)
      return this._WIF
    }
  }

  /** @type {string} */
  get privateKey () {
    if (this._privateKey) {
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

  /** @type {string} */
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

  /** @type {string} */
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
    this._encrypted = encrypt(this._privateKey, keyphrase, scryptParams)
    return this
  }

  /**
   * Decrypts the encrypted key and return the Account object.
   * @param {string} keyphrase
   * @param {object} [scryptParams]
   * @return {Account} this
   */
  decrypt (keyphrase, scryptParams = undefined) {
    this._WIF = decrypt(this._encrypted, keyphrase, scryptParams)
    return this
  }

  /**
   * Export Account as a Wallet Account object.
   * @return {WalletAccount}
   */
  export () {
    return {
      address: this.address,
      label: this.label,
      isDefault: this.isDefault,
      lock: this.lock,
      key: this.encrypted,
      contract: {},
      extra: this.extra
    }
  }
}

export default Account
