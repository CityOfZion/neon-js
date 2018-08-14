import { generateSignature, getPublicKeyUnencoded, getPrivateKeyFromWIF, verifySignature } from './core'
import { isHex, str2hexstring } from '../utils'
import { isPublicKey, isPrivateKey, isWIF } from './verify'

/**
 * Generates a signature of the message based on given private key.
 * @param {string} message ASCII message to sign. This message will be converted to HEX first before hashing.
 * @param {string} privateKey HEX or WIF format.
 * @return {string} HEX signature
 */
export const signMessage = (message, privateKey) => {
  if (!isPrivateKey(privateKey) && !isWIF(privateKey)) throw new Error('Invalid private key or WIF')
  if (isWIF(privateKey)) privateKey = getPrivateKeyFromWIF(privateKey)

  const messageHex = str2hexstring(message)
  return generateSignature(messageHex, privateKey)
}

/**
 * Verifies signature matches message and is valid for given public key.
 * @param {string} message ASCII message to verify.
 * @param {string} publicKey unencoded / encoded public key.
 * @param {string} signature HEX signature.
 * @return {boolean}
 */
export const verifyMessage = (message, signature, publicKey) => {
  if (!isHex(signature)) throw new Error('Invalid signature format expected hex')
  if (!isPublicKey(publicKey)) throw new Error('Invalid public key')
  if (!isPublicKey({ key: publicKey, encoded: true })) publicKey = getPublicKeyUnencoded(publicKey)

  const messageHex = str2hexstring(message)
  return verifySignature(messageHex, signature, publicKey)
}
