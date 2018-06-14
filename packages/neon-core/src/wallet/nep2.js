/**
 * NEP2 - Private Key Encryption based on AES.
 * This encrypts your private key with a passphrase, protecting your private key from being stolen and used.
 * It is useful for storing private keys in a JSON file securely or to mask the key before printing it.
 */
import bs58check from 'bs58check' // This is importable because WIF specifies it as a dependency.
import latin1Encoding from 'crypto-js/enc-latin1'
import hexEncoding from 'crypto-js/enc-hex'
import SHA256 from 'crypto-js/sha256'
import AES from 'crypto-js/aes'
import ECBMode from 'crypto-js/mode-ecb'
import NoPadding from 'crypto-js/pad-nopadding'
import asyncScrypt from 'scrypt-js'
import Account from './Account'
import { ab2hexstring, hexXor } from '../utils'
import { DEFAULT_SCRYPT, NEP_HEADER, NEP_FLAG } from '../consts'
import logger from '../logging'

const enc = {
  Latin1: latin1Encoding,
  Hex: hexEncoding
}

const AES_OPTIONS = { mode: ECBMode, padding: NoPadding }

const log = logger('wallet')
log.warn('ScryptParams will be changing to use n,r,p in place of cost, blockSize, parallel. New standard will be preferred. DEFAULT_SCRYPT will use new standard upon major version bump.')
/**
 * @typedef ScryptParams
 * @param {number} n - (n) Must be power of 2. 2^8 - 2^64
 * @param {number} r - (r) 1 - 256
 * @param {number} p - (p) 1 - 256
 */

/**
 * Encrypts a WIF key using a given keyphrase under NEP-2 Standard.
 * @param {string} wifKey - WIF key to encrypt (52 chars long).
 * @param {string} keyphrase - The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param {scryptParams} [scryptParams] - Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns {Promise<string>} The encrypted key in Base58 (Case sensitive).
 */
export const encrypt = (wifKey, keyphrase, scryptParams = DEFAULT_SCRYPT) => {
  return new Promise((resolve, reject) => {
    const { n, r, p } = scryptParams
    const account = new Account(wifKey)
    // SHA Salt (use the first 4 bytes)
    const addressHash = SHA256(SHA256(enc.Latin1.parse(account.address))).toString().slice(0, 8)
    asyncScrypt(Buffer.from(keyphrase.normalize('NFC'), 'utf8'), Buffer.from(addressHash, 'hex'), n, r, p, 64, (error, progress, key) => {
      if (error != null) {
        reject(error)
      } else if (key) {
        const derived = Buffer.from(key).toString('hex')
        const derived1 = derived.slice(0, 64)
        const derived2 = derived.slice(64)
        // AES Encrypt
        const xor = hexXor(account.privateKey, derived1)
        const encrypted = AES.encrypt(enc.Hex.parse(xor), enc.Hex.parse(derived2), AES_OPTIONS)
        const assembled = NEP_HEADER + NEP_FLAG + addressHash + encrypted.ciphertext.toString()
        const encryptedKey = bs58check.encode(Buffer.from(assembled, 'hex'))
        log.info(`Successfully encrypted key to ${encryptedKey}`)
        resolve(encryptedKey)
      }
    })
  })
}

/**
 * Decrypts an encrypted key using a given keyphrase under NEP-2 Standard.
 * @param {string} encryptedKey - The encrypted key (58 chars long).
 * @param {string} keyphrase - The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param {scryptParams} [scryptParams] - Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns {Promise<string>} The decrypted WIF key.
 */
export const decrypt = (encryptedKey, keyphrase, scryptParams = DEFAULT_SCRYPT) => {
  return new Promise((resolve, reject) => {
    const { n, r, p } = scryptParams
    const assembled = ab2hexstring(bs58check.decode(encryptedKey))
    const addressHash = assembled.substr(6, 8)
    const encrypted = assembled.substr(-64)
    asyncScrypt(Buffer.from(keyphrase.normalize('NFC'), 'utf8'), Buffer.from(addressHash, 'hex'), n, r, p, 64, (error, progress, key) => {
      if (error != null) {
        reject(error)
      } else if (key) {
        const derived = Buffer.from(key).toString('hex')
        const derived1 = derived.slice(0, 64)
        const derived2 = derived.slice(64)
        const ciphertext = { ciphertext: enc.Hex.parse(encrypted), salt: '' }
        const decrypted = AES.decrypt(ciphertext, enc.Hex.parse(derived2), AES_OPTIONS)
        const privateKey = hexXor(decrypted.toString(), derived1)
        const account = new Account(privateKey)
        const newAddressHash = SHA256(SHA256(enc.Latin1.parse(account.address))).toString().slice(0, 8)
        if (addressHash !== newAddressHash) reject(new Error('Wrong Password or scrypt parameters!'))
        log.info(`Successfully decrypted ${encryptedKey}`)
        resolve(account.WIF)
      }
    })
  })
}
