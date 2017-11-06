import { num2hexstring, num2VarInt, reverseHex, fixed82num, num2fixed8 } from '../utils'

/**
 * @typedef TransactionInput
 * @property {string} prevHash - Transaction hash, Uint256
 * @property {number} prevIndex - Index of the coin in the previous transaction, Uint16
 */

export const serializeTransactionInput = (input) => {
  return reverseHex(input.prevHash) + reverseHex(num2hexstring(input.prevIndex, 4))
}

export const deserializeTransactionInput = (stream) => {
  const prevHash = reverseHex(stream.read(32))
  const prevIndex = parseInt(reverseHex(stream.read(2)), 16)
  return { prevHash, prevIndex }
}

/**
 * @typedef TransactionOutput
 * @property {string} assetId - assetId, Uint256
 * @property {number} value - value of output, Fixed8
 * @property {string} scriptHash - Uint160
 */

export const serializeTransactionOutput = (output) => {
  const value = num2fixed8(output.value)
  return reverseHex(output.assetId) + value + reverseHex(output.scriptHash)
}

export const deserializeTransactionOutput = (stream) => {
  const assetId = reverseHex(stream.read(32))
  const value = fixed82num(stream.read(8))
  const scriptHash = reverseHex(stream.read(20))
  return { assetId, value, scriptHash }
}

/**
 * @typedef TransactionAttribute
 * @property {number} usage - Identifying byte
 * @property {string} data - Data
 */
const maxTransactionAttributeSize = 65535

export const serializeTransactionAttribute = (attr) => {
  if (attr.data.length > maxTransactionAttributeSize) throw new Error()
  let out = num2hexstring(attr.usage)
  if (attr.usage === 0x81) {
    out += num2hexstring(attr.data.length)
  } else if (attr.usage === 0x90 || attr.usage >= 0xf0) {
    out += num2VarInt(attr.data.length)
  }
  if (attr.usage === 0x02 || attr.usage === 0x03) {
    out += attr.data.substr(2, 64)
  } else {
    out += attr.data
  }
  return out
}

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

export const serializeWitness = (witness) => {
  const invoLength = num2VarInt(witness.invocationScript.length / 2)
  const veriLength = num2VarInt(witness.verificationScript.length / 2)
  return invoLength + witness.invocationScript + veriLength + witness.verificationScript
}

export const deserializeWitness = (stream) => {
  const invocationScript = stream.readVarBytes()
  const verificationScript = stream.readVarBytes()
  return { invocationScript, verificationScript }
}
