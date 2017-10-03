import ecurve from 'ecurve'
import BigInteger from 'bigi'
import { ec as EC } from 'elliptic'
import CryptoJS from 'crypto-js'
import WIF from 'wif'
import {
  hexstring2ab,
  ab2hexstring
} from './utils'
import secureRandom from 'secure-random'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
let base58 = require('base-x')(BASE58)

/**
 * @typedef {Object} Account
 * @property {string} privateKey The private key in hex
 * @property {string} publicKeyEncoded The public key in encoded form
 * @property {string} publicKeyHash Hash of the public key
 * @property {string} programHash Program Hash to use for signing
 * @property {string} address Public address of the private key
 */

/**
 * Constructs a signed transaction.
 * @param {string} txData - Unsigned serialized transaction.
 * @param {string} sign - Signature obtained from signatureData.
 * @param {string} publicKeyEncoded - Public key in encoded form.
 * @return {string} A signed transaction ready to be sent over RPC.
 */
export const addContract = (txData, sign, publicKeyEncoded) => {
  let signatureScript = createSignatureScript(publicKeyEncoded)
  // console.log(signatureScript);
  // sign num
  let data = txData + '01'
  // sign struct len
  data = data + '41'
  // sign data len
  data = data + '40'
  // sign data
  data = data + sign
  // Contract data len
  data = data + '23'
  // script data
  data = data + signatureScript
  // console.log(data);
  return data
}

/**
 * Create Signature Script
 * @param {string|ArrayBuffer} publicKeyEncoded - Public Key in encoded form
 * @return {string} Signature Script
 */
export const createSignatureScript = (publicKeyEncoded) => {
  if (publicKeyEncoded instanceof ArrayBuffer) publicKeyEncoded = publicKeyEncoded.toString('hex')
  return '21' + publicKeyEncoded + 'ac'
}

/**
 * Encodes Private Key into WIF
 * @param {ArrayBuffer} privateKey - Private Key
 * @returns {string} WIF key
 */
export const getWIFFromPrivateKey = (privateKey) => {
  const hexKey = ab2hexstring(privateKey)
  return WIF.encode(128, Buffer.from(hexKey, 'hex'), true)
}

/**
 * Generates a random private key
 * @returns {ArrayBuffer} An ArrayBuffer of 32 bytes
 */
export const generatePrivateKey = () => {
  return secureRandom(32)
}

export const generateRandomArray = ($arrayLen) => {
  return secureRandom($arrayLen)
}

/**
 * Get Account from Private Key
 * @param {string} privateKey - Private Key
 * @returns {Account} An Account object
 */
export const getAccountFromPrivateKey = (privateKey) => {
  if (privateKey.length !== 64) {
    return -1
  }
  const publicKeyEncoded = getPublicKey(privateKey, true)
  // console.log(publicKeyEncoded)
  return getAccountFromPublicKey(ab2hexstring(publicKeyEncoded), privateKey)
}

/**
 * Get Account from Public Key
 * @param {string} publicKeyEncoded - Public Key in encoded form
 * @param {string} privateKey - Private Key (optional)
 * @returns {Account} An Account object
 */
export const getAccountFromPublicKey = (publicKeyEncoded, privateKey) => {
  if (!verifyPublicKeyEncoded(publicKeyEncoded)) {
    // verify failed.
    return -1
  }
  const publicKeyHash = getHash(publicKeyEncoded)
  // console.log(publicKeyHash)

  const script = createSignatureScript(publicKeyEncoded)
  // console.log(script)

  const programHash = getHash(script)
  // console.log(programHash)

  const address = toAddress(hexstring2ab(programHash))
  // console.log(address)

  return { privateKey, publicKeyEncoded, publicKeyHash, programHash, address }
}

/**
 * Get Account from WIF
 * @param {string} WIFKey - WIF Key
 * @returns {Account|number} An Account object or -1 for basic encoding errors, -2 for failed verification of WIF
 */
export const getAccountFromWIFKey = (WIFKey) => {
  let privateKey = getPrivateKeyFromWIF(WIFKey)
  if (privateKey === -1 || privateKey === -2) {
    return privateKey
  }
  return getAccountFromPrivateKey(privateKey)
}

/**
 * Get hash of string input
 * @param {string} signatureScript - String input
 * @returns {string} Hashed output
 */
export const getHash = (signatureScript) => {
  let ProgramHexString = CryptoJS.enc.Hex.parse(signatureScript)
  let ProgramSha256 = CryptoJS.SHA256(ProgramHexString)
  return CryptoJS.RIPEMD160(ProgramSha256).toString()
}

/**
 * Get private key from WIF key.
 * @param {string} wif - WIF key
 * @return {string} Private key
 */
export const getPrivateKeyFromWIF = (wif) => {
  let data = base58.decode(wif)

  if (data.length !== 38 || data[0] !== 0x80 || data[33] !== 0x01) {
    // basic encoding errors
    return -1
  }

  let dataHexString = CryptoJS.enc.Hex.parse(ab2hexstring(data.slice(0, data.length - 4)))
  let dataSha = CryptoJS.SHA256(dataHexString)
  let dataSha2 = CryptoJS.SHA256(dataSha)
  let dataShaBuffer = hexstring2ab(dataSha2.toString())

  if (ab2hexstring(dataShaBuffer.slice(0, 4)) !== ab2hexstring(data.slice(data.length - 4, data.length))) {
    // wif verify failed.
    return -2
  }

  return data.slice(1, 33).toString('hex')
}

/**
 * Get public key from private key.
 * @param {string} privateKey - Private Key.
 * @param {boolean} encode - If the returned public key should be encrypted. Defaults to true
 * @return {ArrayBuffer} ArrayBuffer containing the public key.
 */
export const getPublicKey = (privateKey, encode) => {
  let ecparams = ecurve.getCurveByName('secp256r1')
  let curvePt = ecparams.G.multiply(BigInteger.fromBuffer(hexstring2ab(privateKey)))
  return curvePt.getEncoded(encode)
}

/**
 * Encodes an unencoded public key.
 * @param {string} publicKey - Unencoded public key.
 * @return {string} Encoded public key.
 */
export const getPublicKeyEncoded = (publicKey) => {
  let publicKeyArray = hexstring2ab(publicKey)
  if (publicKeyArray[64] % 2 === 1) {
    return '03' + ab2hexstring(publicKeyArray.slice(1, 33))
  } else {
    return '02' + ab2hexstring(publicKeyArray.slice(1, 33))
  }
}

/**
 * Constructs a valid address from a scriptHash
 * @param {ArrayBuffer} scriptHash - scriptHash obtained from hashing the address
 * @returns {string} A valid NEO address
 */
export const toAddress = (scriptHash) => {
  if (scriptHash.length !== 20) throw new Error('Invalid ScriptHash length')
  let data = new Uint8Array(1 + scriptHash.length)
  data.set([23]) // Wallet addressVersion
  data.set(scriptHash, 1)
  // console.log(ab2hexstring(data))

  let scriptHashHex = CryptoJS.enc.Hex.parse(ab2hexstring(data))
  let scriptHashSha = CryptoJS.SHA256(scriptHashHex)
  let scriptHashSha2 = CryptoJS.SHA256(scriptHashSha)
  let scriptHashShaBuffer = hexstring2ab(scriptHashSha2.toString())
  // console.log(ab2hexstring(ProgramSha256Buffer))

  let datas = new Uint8Array(1 + scriptHash.length + 4)
  datas.set(data)
  datas.set(scriptHashShaBuffer.slice(0, 4), 21)
  // console.log(ab2hexstring(datas))

  return base58.encode(datas)
}

/**
 * Signs a transaction with a private key
 * @param {string} data - Serialised transaction data.
 * @param {string} privateKey - Private Key
 * @returns {string} Signature data.
 */
export const signatureData = (data, privateKey) => {
  let msg = CryptoJS.enc.Hex.parse(data)
  let msgHash = CryptoJS.SHA256(msg)
  const msgHashHex = Buffer.from(msgHash.toString(), 'hex')
  // const privateKeyHex = Buffer.from($privateKey, 'hex')
  // console.log( "msgHash:", msgHashHex.toString('hex'));
  // console.log('buffer', privateKeyHex.toString('hex'));

  let elliptic = new EC('p256')
  const sig = elliptic.sign(msgHashHex, privateKey, null)
  const signature = {
    signature: Buffer.concat([
      sig.r.toArrayLike(Buffer, 'be', 32),
      sig.s.toArrayLike(Buffer, 'be', 32)
    ])
  }
  return signature.signature.toString('hex')
}

/**
 * Verifies if the string is a valid NEO address.
 * @param {string} address - A string that can be a NEO address.
 * @returns {boolean} True if the string is a valid NEO address.
 */
export const verifyAddress = (address) => {
  let programHash = base58.decode(address)
  let programHexString = CryptoJS.enc.Hex.parse(ab2hexstring(programHash.slice(0, 21)))
  let programSha256 = CryptoJS.SHA256(programHexString)
  let programSha256Twice = CryptoJS.SHA256(programSha256)
  let programSha256Buffer = hexstring2ab(programSha256Twice.toString())

  // We use the checksum to verify the address
  if (ab2hexstring(programSha256Buffer.slice(0, 4)) !== ab2hexstring(programHash.slice(21, 25))) {
    return false
  }

  // As other chains use similar checksum methods, we need to attempt to transform the programHash back into the address
  if (toAddress(programHash.slice(1, 21)) !== address) {
    // address is not valid Neo address, could be btc, ltc etc.
    return false
  }

  return true
}

/**
 * Verifies if the string is a valid public key.
 * @param {string} publicKeyEncoded - A string that is a possible public key in encoded form.
 * @returns {boolean} True if the string is a valid encoded public key.
 */
export const verifyPublicKeyEncoded = (publicKeyEncoded) => {
  let publicKeyArray = hexstring2ab(publicKeyEncoded)
  if (publicKeyArray[0] !== 0x02 && publicKeyArray[0] !== 0x03) {
    return false
  }

  let ecparams = ecurve.getCurveByName('secp256r1')
  let curvePt = ecurve.Point.decodeFrom(ecparams, Buffer.from(publicKeyEncoded, 'hex'))
  // let curvePtX = curvePt.affineX.toBuffer(32)
  let curvePtY = curvePt.affineY.toBuffer(32)

  // console.log( "publicKeyArray", publicKeyArray )
  // console.log( "curvePtX", curvePtX )
  // console.log( "curvePtY", curvePtY )

  if (publicKeyArray[0] === 0x02 && curvePtY[31] % 2 === 0) {
    return true
  }

  if (publicKeyArray[0] === 0x03 && curvePtY[31] % 2 === 1) {
    return true
  }

  return false
}
