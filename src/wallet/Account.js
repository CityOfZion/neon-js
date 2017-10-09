import * as core from './core'
import { isPrivateKey, isPublicKey, isWIF, isAddress, isNEP2 } from './verify'

/**
 * Account class for simple management of keys.
 * This allows for simple utilisation and manipulating of keys without need the long access methods.
 * Key formats are derived from each other lazily and stored for future access.
 * If the previous key (one level higher) is not found, it will attempt to generate it or throw an Error if insufficient information was provided (eg. trying to generate private key when only address was given.)
 */
export default class Account {
  /**
   * Creates an Account. Accepts private key, WIF, public key or address.
   * @param {string} str - A key in any format.
   */
  constructor (str) {
    if (isPrivateKey(str)) {
      this._privateKey = str
    } else if (isPublicKey(str)) {
      this._publicKey = str
    } else if (isAddress(str)) {
      this._address = str
    } else if (isWIF(str)) {
      this._privateKey = core.getPrivateKeyFromWIF(str)
    } else if (isNEP2(str)) {
      throw new ReferenceError(`Account does not support NEP2. Please decode first.`)
    } else {
      throw new ReferenceError(`Invalid input: ${str}`)
    }
  }

  /** @return {string} */
  get WIF () {
    if (this._WIF) {
      return this._WIF
    } else {
      this._WIF = core.getWIFFromPrivateKey(this._privateKey)
      return this._WIF
    }
  }

  /** @return {string} */
  get privateKey () {
    if (this._privateKey) {
      return this._privateKey
    } else {
      throw new ReferenceError('No Private Key provided!')
    }
  }

  /** @return {string} */
  get publicKey () {
    if (this._publicKey) {
      return this._publicKey
    } else {
      this._publicKey = core.getPublicKeyFromPrivateKey(this.privateKey)
      return this._publicKey
    }
  }

  /** @return {string} */
  get scriptHash () {
    if (this._scriptHash) {
      return this._scriptHash
    } else {
      this._scriptHash = core.getScriptHashFromPublicKey(this.publicKey)
      return this._scriptHash
    }
  }

  /** @return {string} */
  get address () {
    if (this._address) {
      return this._address
    } else {
      this._address = core.getAddressFromScriptHash(this.scriptHash)
      return this._address
    }
  }
}
