import { num2hexstring, num2VarInt, reverseHex, Fixed8 } from '../utils'
import { getScriptHashFromAddress } from '../wallet'
import { ASSET_ID } from '../consts'

/**
 * @typedef TransactionInput
 * @property {string} prevHash - Transaction hash, Uint256
 * @property {number} prevIndex - Index of the coin in the previous transaction, Uint16
 */

/**
 * Serializes a TransactionInput.
 * @param {TransactionInput} input
 * @return {string}
 */
export const serializeTransactionInput = (input) => {
  return reverseHex(input.prevHash) + reverseHex(num2hexstring(input.prevIndex, 2))
}

/**
 * Deserializes a stream of hexstring into a TransactionInput.
 * @param {StringStream} stream
 * @return {TransactionInput}
 */
export const deserializeTransactionInput = (stream) => {
  const prevHash = reverseHex(stream.read(32))
  const prevIndex = parseInt(reverseHex(stream.read(2)), 16)
  return { prevHash, prevIndex }
}

/**
 * @typedef TransactionOutput
 * @property {string} assetId - assetId, Uint256
 * @property {number|Fixed8} value - value of output, Fixed8
 * @property {string} scriptHash - Uint160
 */
export const TransactionOutput = (input) => {
  return {
    assetId: input.assetId,
    value: new Fixed8(input.value),
    scriptHash: input.scriptHash
  }
}

/**
 * Serializes a TransactionOutput.
 * @param {TransactionOutput} output
 * @return {string}
 */
export const serializeTransactionOutput = (output) => {
  const value = new Fixed8(output.value).toReverseHex()
  return reverseHex(output.assetId) + value + reverseHex(output.scriptHash)
}

/**
 * Deserializes a stream into a TransactionOutput.
 * @param {StringStream} stream
 * @return {TransactionOutput}
 */
export const deserializeTransactionOutput = (stream) => {
  const assetId = reverseHex(stream.read(32))
  const value = Fixed8.fromReverseHex(stream.read(8))
  const scriptHash = reverseHex(stream.read(20))
  return { assetId, value, scriptHash }
}

/**
 * A helper method to create a TransactionOutput using human-friendly inputs.
 * @param {string} assetSym - The Symbol of the asset to send. Typically NEO or GAS.
 * @param {number|Fixed8} val - The value to send.
 * @param {string} address - The address to send the asset to.
 * @return {TransactionOutput}
 */
export const createTransactionOutput = (assetSym, val, address) => {
  const assetId = ASSET_ID[assetSym]
  const scriptHash = getScriptHashFromAddress(address)
  const value = new Fixed8(val)
  return { assetId, value, scriptHash }
}

/**
 * @typedef TransactionAttribute
 * @property {number} usage - Identifying byte
 * @property {string} data - Data
 */
const maxTransactionAttributeSize = 65535

/**
 * Serializes a TransactionAttribute.
 * @param {TransactionAttribute} attr
 * @return {string}
 */
export const serializeTransactionAttribute = (attr) => {
  if (attr.data.length > maxTransactionAttributeSize) throw new Error()
  let out = num2hexstring(attr.usage)
  if (attr.usage === 0x81) {
    out += num2hexstring(attr.data.length / 2)
  } else if (attr.usage === 0x90 || attr.usage >= 0xf0) {
    out += num2VarInt(attr.data.length / 2)
  }
  if (attr.usage === 0x02 || attr.usage === 0x03) {
    out += attr.data.substr(2, 64)
  } else {
    out += attr.data
  }
  return out
}

/**
 * Deserializes a stream into a TransactionAttribute
 * @param {StringStream} stream
 * @return {TransactionAttribute}
 */
export const deserializeTransactionAttribute = (stream) => {
  const attr = {
    usage: parseInt(stream.read(1), 16)
  }
  if (attr.usage === 0x00 || attr.usage === 0x30 || (attr.usage >= 0xa1 && attr.usage <= 0xaf)) {
    attr.data = stream.read(32)
  } else if (attr.usage === 0x02 || attr.usage === 0x03) {
    attr.data = num2hexstring(attr.usage) + stream.read(32)
  } else if (attr.usage === 0x20) {
    attr.data = stream.read(20)
  } else if (attr.usage === 0x81) {
    attr.data = stream.read(parseInt(stream.read(1), 16))
  } else if (attr.usage === 0x90 || attr.usage >= 0xf0) {
    attr.data = stream.readVarBytes()
  } else {
    throw new Error()
  }
  return attr
}

/**
 * @typedef Witness
 * @property {string} invocationScript - This data is stored as is (Little Endian)
 * @property {string} verificationScript - This data is stored as is (Little Endian)
 */

/**
 * Serializes a Witness.
 * @param {Witness} witness
 * @return {string}
 */
export const serializeWitness = (witness) => {
  const invoLength = num2VarInt(witness.invocationScript.length / 2)
  const veriLength = num2VarInt(witness.verificationScript.length / 2)
  return invoLength + witness.invocationScript + veriLength + witness.verificationScript
}

/**
 * Deserializes a stream into a Witness
 * @param {StringStream} stream
 * @return {Witness}
 */
export const deserializeWitness = (stream) => {
  const invocationScript = stream.readVarBytes()
  const verificationScript = stream.readVarBytes()
  return { invocationScript, verificationScript }
}
