/**
 * Verification methods on the various key formats.
 * Useful for identification and ensuring key is valid.
 *
 * Methods are named as is<Format> where:
 * <Format> is the key format to check.
 *
 * All methods take in Big-Endian strings and return boolean.
 */

import ecurve from 'ecurve'
import { hexstring2ab, ab2hexstring, reverseHex, base58, hash256 } from '../utils'
import { getAddressFromScriptHash } from './core'

/**
 * Verifies a NEP2. This merely verifies the format. It is unable to verify if it is has been tampered with.
 * @param {string} nep2
 * @return {boolean}
 */
export const isNEP2 = (nep2) => {
  try {
    if (nep2.length !== 58) return false
    const hexStr = ab2hexstring(base58.decode(nep2))
    if (!hexStr) return false
    if (hexStr.length !== 86) return false
    if (hexStr.substr(0, 2) !== '01') return false
    if (hexStr.substr(2, 2) !== '42') return false
    if (hexStr.substr(4, 2) !== 'e0') return false
    return true
  } catch (e) { return false }
}

/**
 * Verifies a WIF using its checksum.
 * @param {string} wif
 * @return {boolean}
 */
export const isWIF = (wif) => {
  if (wif.length !== 52) return false
  const hexStr = ab2hexstring(base58.decode(wif))
  const shaChecksum = hash256(hexStr.substr(0, hexStr.length - 8)).substr(0, 8)
  return shaChecksum === hexStr.substr(hexStr.length - 8, 8)
}
/**
 * Checks if hexstring is a valid Private Key. Any hexstring of 64 chars is a valid private key.
 * @param {string} key
 * @return {boolean}
 */
export const isPrivateKey = (key) => {
  return /^[0-9A-Fa-f]{64}$/.test(key)
}

/**
 * Checks if hexstring is a valid Public Key.
 * @param {string} key - Public Key
 * @return {boolean}
 */
export const isPublicKey = (key) => {
  try {
    let publicKeyArray = hexstring2ab(key)
    if (publicKeyArray[0] !== 0x02 && publicKeyArray[0] !== 0x03) return false

    let ecparams = ecurve.getCurveByName('secp256r1')
    let curvePt = ecurve.Point.decodeFrom(ecparams, Buffer.from(key, 'hex'))
    let curvePtY = curvePt.affineY.toBuffer(32)

    if (publicKeyArray[0] === 0x02 && curvePtY[31] % 2 === 0) return true
    if (publicKeyArray[0] === 0x03 && curvePtY[31] % 2 === 1) return true
  } catch (e) { }
  return false
}

/**
 * Verifies an address using its checksum
 * @param {string} address
 * @return {boolean}
 */
export const isAddress = (address) => {
  let programHash = ab2hexstring(base58.decode(address))
  let shaChecksum = hash256(programHash.slice(0, 42)).substr(0, 8)
  // We use the checksum to verify the address
  if (shaChecksum !== programHash.substr(42, 8)) return false
  // As other chains use similar checksum methods, we need to attempt to transform the programHash back into the address
  const scriptHash = reverseHex(programHash.slice(2, 42))
  if (getAddressFromScriptHash(scriptHash) !== address) {
    // address is not valid Neo address, could be btc, ltc etc.
    return false
  }
  return true
}
