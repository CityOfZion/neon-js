/**
 * NEP2 - Private Key Encryption based on AES.
 * This encrypts your private key with a passphrase, protecting your private key from being stolen and used.
 * It is useful for storing private keys in a JSON file securely or to mask the key before printing it.
 */
import bs58check from 'bs58check' // This is importable because WIF specifies it as a dependency.
import { SHA256, AES, enc, mode, pad } from 'crypto-js'
import scrypt from 'js-scrypt'
import { generatePrivateKey } from './core'
import Account from './Account'
import { ab2hexstring, hexXor } from '../utils'
import { DEFAULT_SCRYPT, NEP_HEADER, NEP_FLAG } from '../consts'
import logger from '../logging'

const log = logger('wallet')

/**
 * @typedef ScryptParams
 * @param {number} cost - (n) Must be power of 2. 2^8 - 2^64
 * @param {number} blockSize - (r) 1 - 256
 * @param {number} parallel - (p) 1 - 256
 */

/**
 * Encrypts a WIF key using a given keyphrase under NEP-2 Standard.
 * @param {string} wifKey - WIF key to encrypt (52 chars long).
 * @param {string} keyphrase - The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param {scryptParams} [scryptParams] - Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns {string} The encrypted key in Base58 (Case sensitive).
 */
export const encrypt = (wifKey, keyphrase, scryptParams = DEFAULT_SCRYPT) => {
  scryptParams = ensureScryptParams(scryptParams)
  const account = new Account(wifKey)
  // SHA Salt (use the first 4 bytes)
  const addressHash = SHA256(SHA256(enc.Latin1.parse(account.address))).toString().slice(0, 8)
  // Scrypt
  const derived = scrypt.hashSync(Buffer.from(keyphrase.normalize('NFC'), 'utf8'), Buffer.from(addressHash, 'hex'), scryptParams).toString('hex')
  const derived1 = derived.slice(0, 64)
  const derived2 = derived.slice(64)
  // AES Encrypt
  const xor = hexXor(account.privateKey, derived1)
  const encrypted = AES.encrypt(enc.Hex.parse(xor), enc.Hex.parse(derived2), { mode: mode.ECB, padding: pad.NoPadding })
  // Construct
  const assembled = NEP_HEADER + NEP_FLAG + addressHash + encrypted.ciphertext.toString()
  return bs58check.encode(Buffer.from(assembled, 'hex'))
}

/**
 * Decrypts an encrypted key using a given keyphrase under NEP-2 Standard.
 * @param {string} encryptedKey - The encrypted key (58 chars long).
 * @param {string} keyphrase - The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param {scryptParams} [scryptParams] - Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns {string} The decrypted WIF key.
 */
export const decrypt = (encryptedKey, keyphrase, scryptParams = DEFAULT_SCRYPT) => {
  scryptParams = ensureScryptParams(scryptParams)
  const assembled = ab2hexstring(bs58check.decode(encryptedKey))
  const addressHash = assembled.substr(6, 8)
  const encrypted = assembled.substr(-64)
  const derived = scrypt.hashSync(Buffer.from(keyphrase.normalize('NFC'), 'utf8'), Buffer.from(addressHash, 'hex'), scryptParams).toString('hex')
  const derived1 = derived.slice(0, 64)
  const derived2 = derived.slice(64)
  const ciphertext = { ciphertext: enc.Hex.parse(encrypted), salt: '' }
  const decrypted = AES.decrypt(ciphertext, enc.Hex.parse(derived2), { mode: mode.ECB, padding: pad.NoPadding })
  const privateKey = hexXor(decrypted.toString(), derived1)
  const account = new Account(privateKey)
  const newAddressHash = SHA256(SHA256(enc.Latin1.parse(account.address))).toString().slice(0, 8)
  if (addressHash !== newAddressHash) throw new Error('Wrong Password!')
  return account.WIF
}

const ensureScryptParams = (params) => Object.assign({}, DEFAULT_SCRYPT, params)
