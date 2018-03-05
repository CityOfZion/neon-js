import BN from 'bn.js'
import { ec as EC } from 'elliptic'
import { generateSignature, getPublicKeyUnencoded, getPrivateKeyFromWIF } from './core'
import { isHex, str2hexstring, sha256 } from '../utils'
import { isPublicKey, isPrivateKey, isWIF } from './verify'

/**
 * Converts signatureHex to a signature object with r & s.
 * @param {string} signatureHex
 */
const getSignatureFromHex = signatureHex => {
  const signatureBuffer = Buffer.from(signatureHex, 'hex')
  const r = new BN(signatureBuffer.slice(0, 32).toString('hex'), 16, 'be')
  const s = new BN(signatureBuffer.slice(32).toString('hex'), 16, 'be')
  return {
    r: r,
    s: s
  }
}

/**
 * Generates a signature of the message based on given private key.
 * @param {string} message
 * @param {string} privateKey or WIF
 * @return {string} signature
 */
export const signMessage = (message, privateKey) => {
  if (!isPrivateKey(privateKey) && !isWIF(privateKey)) throw new Error('Invalid private key or WIF')
  if (isWIF(privateKey)) privateKey = getPrivateKeyFromWIF(privateKey)

  const messageHex = str2hexstring(message)
  return generateSignature(messageHex, privateKey)
}

/**
 * Verifies signature matches message and is valid for given public key.
 * @param {string} message
 * @param {string} publicKey
 * @param {string} signature
 * @return {boolean}
 */
export const verifyMessage = (message, signature, publicKey) => {
  if (!isHex(signature)) throw new Error('Invalid signature format expected hex')
  if (!isPublicKey(publicKey)) throw new Error('Invalid public key')
  if (!isPublicKey({ key: publicKey, encoded: true })) publicKey = getPublicKeyUnencoded(publicKey)

  const ecdsa = new EC('p256')
  const sig = getSignatureFromHex(signature)
  const messageHex = str2hexstring(message)
  const messageHash = sha256(messageHex)
  return ecdsa.verify(messageHash, sig, publicKey, 'hex')
}
