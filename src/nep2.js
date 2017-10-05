// this code draws heavily from functions written originally by snowypowers

import bs58check from 'bs58check'
import C, { SHA256, AES, enc } from 'crypto-js'
import scrypt from 'js-scrypt'
import { getAccountFromWIFKey, getAccountFromPrivateKey, generatePrivateKey, getWIFFromPrivateKey } from './wallet'
import { ab2hexstring, hexXor } from './utils'

// specified by nep2, same as bip38
const NEP_HEADER = '0142'
const NEP_FLAG = 'e0'
const SCRYPT_OPTS = {
  cost: 16384,
  blockSize: 8,
  parallel: 8,
  size: 64
}

/**
 * Encrypts an WIF key with a given passphrase, returning a Promise<Account>.
 * @param {string} wif - The WIF key to encrypt.
 * @param {string} passphrase - The password.
 * @return {Promise<Account>} A Promise returning an Account object.
 */
export const encryptWifAccount = (wif, passphrase) => {
  return encryptWIF(wif, passphrase).then((encWif) => {
    const loadAccount = getAccountFromWIFKey(wif)
    return {
      wif,
      address: loadAccount.address,
      encryptedWif: encWif,
      passphrase
    }
  })
}

/**
 * Generates a new private Key and encrypts it with the given passphrase.
 * @param {string} passphrase - The password.
 * @return {Promise<Account>} A Promise returning an Account object.
 */
export const generateEncryptedWif = (passphrase) => {
  const newPrivateKey = generatePrivateKey()
  const newWif = getWIFFromPrivateKey(newPrivateKey)
  return encryptWIF(newWif, passphrase).then((encWif) => {
    const loadAccount = getAccountFromWIFKey(newWif)
    return {
      wif: newWif,
      address: loadAccount.address,
      encryptedWif: encWif,
      passphrase
    }
  })
}

/**
 * Encrypts a WIF key using a given keyphrase under NEP-2 Standard.
 * @param {string} wifKey - WIF key to encrypt (52 chars long).
 * @param {string} keyphrase - The password. Will be encoded as UTF-8.
 * @returns {string} The encrypted key in Base58 (Case sensitive).
 */
const encrypt = (wifKey, keyphrase) => {
  const account = getAccountFromWIFKey(wifKey)
    // SHA Salt (use the first 4 bytes)
  const addressHash = SHA256(SHA256(enc.Latin1.parse(account.address))).toString().slice(0, 8)
    // Scrypt
  const derived = scrypt.hashSync(Buffer.from(keyphrase, 'utf8'), Buffer.from(addressHash, 'hex'), SCRYPT_OPTS).toString('hex')
  const derived1 = derived.slice(0, 64)
  const derived2 = derived.slice(64)
    // AES Encrypt
  const xor = hexXor(account.privateKey, derived1)
  const encrypted = AES.encrypt(enc.Hex.parse(xor), enc.Hex.parse(derived2), { mode: C.mode.ECB, padding: C.pad.NoPadding })
    // Construct
  const assembled = NEP_HEADER + NEP_FLAG + addressHash + encrypted.ciphertext.toString()
  return bs58check.encode(Buffer.from(assembled, 'hex'))
}

/**
 * Decrypts an encrypted key using a given keyphrase under NEP-2 Standard.
 * @param {string} encryptedKey - The encrypted key (58 chars long).
 * @param {string} keyphrase - The password. Will be encoded as UTF-8.
 * @returns {string} The decrypted WIF key.
 */
const decrypt = (encryptedKey, keyphrase) => {
  const assembled = ab2hexstring(bs58check.decode(encryptedKey))
  const addressHash = assembled.substr(6, 8)
  const encrypted = assembled.substr(-64)
  const derived = scrypt.hashSync(Buffer.from(keyphrase, 'utf8'), Buffer.from(addressHash, 'hex'), SCRYPT_OPTS).toString('hex')
  const derived1 = derived.slice(0, 64)
  const derived2 = derived.slice(64)
  const ciphertext = { ciphertext: enc.Hex.parse(encrypted), salt: '' }
  const decrypted = AES.decrypt(ciphertext, enc.Hex.parse(derived2), { mode: C.mode.ECB, padding: C.pad.NoPadding })
  const privateKey = hexXor(decrypted.toString(), derived1)
  const address = getAccountFromPrivateKey(privateKey).address
  const newAddressHash = SHA256(SHA256(enc.Latin1.parse(address))).toString().slice(0, 8)
  if (addressHash !== newAddressHash) throw new Error('Wrong Password!')
  return getWIFFromPrivateKey(Buffer.from(privateKey, 'hex'))
}

// helpers to wrap synchronous functions in promises

export const encryptWIF = (wif, passphrase) => {
  return Promise.resolve(encrypt(wif, passphrase))
}

export const decryptWIF = (encrypted, passphrase) => {
  return Promise.resolve(decrypt(encrypted, passphrase))
}
