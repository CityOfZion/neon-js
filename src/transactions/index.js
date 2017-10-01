import { num2hexstring, num2VarInt, ab2hexstring, StringStream, reverseHex, numStoreInMemory } from '../utils.js'

/**
 * NEO's default Endianness from RPC calls is Little Endian.
 * However, we will store our data in Big Endian unless stated.
 * This helps us in utilising the data we have in terms of displaying
 * and makes it easy to interact with other tools (eg pasting into block explorer)
 */

/**
 * @typedef TransactionInput
 * @property {string} prevHash - Transaction hash, Uint256
 * @property {number} prevIndex - Index of the coin in the previous transaction, Uint16
 */

const serializeTransactionInput = (input) => {
  return reverseHex(input.prevHash) + reverseHex(num2hexstring(input.prevIndex, 4))
}

const deserializeTransactionInput = (stream) => {
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

const serializeTransactionOutput = (output) => {
  const hexValue = (output.value * 100000000).toString(16)
  const paddedValue = reverseHex(('0000000000000000' + hexValue).substring(hexValue.length))
  return reverseHex(output.assetId) + paddedValue + reverseHex(output.scriptHash)
}

const deserializeTransactionOutput = (stream) => {
  const assetId = reverseHex(stream.read(32))
  const value = parseInt(reverseHex(stream.read(8)), 16) / 100000000
  const scriptHash = reverseHex(stream.read(20))
  return { assetId, value, scriptHash }
}

/**
 * @typedef TransactionAttribute
 * @property {number} usage - Identifying byte
 * @property {string} data - Data
 */
const maxTransactionAttributeSize = 65535

const serializeTransactionAttribute = (attr) => {
  if (attr.data.length > maxTransactionAttributeSize) throw new Error()
  let out = num2hexstring(attr.usage)
  if (attr.usage === 0x81) {
    out += num2hexstring(data.length)
  } else if (attr.usage === 0x90 || attr.usage >= 0xf0) {
    out += num2VarInt(data.length)
  }
  if (attr.usage === 0x02 || attr.usage === 0x03) {
    out += attr.data.substr(2, 64)
  } else {
    out == attr.data
  }
  return out
}

const deserializeTransactionAttribute = (stream) => {
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

const serializeWitness = (witness) => {
  const invoLength = (witness.invocationScript.length / 2).toString(16)
  const veriLength = (witness.verificationScript.length / 2).toString(16)
  return invoLength + witness.invocationScript + veriLength + witness.verificationScript
}

const deserializeWitness = (stream) => {
  const invocationScript = stream.readVarBytes()
  const verificationScript = stream.readVarBytes()
  return { invocationScript, verificationScript }
}

/**
 * @typedef Transaction
 * @property {number} type
 * @property {number} version
 * @property {TransactionAttribute[]} attributes
 * @property {TransactionInput[]} inputs
 * @property {TransactionOutput[]} outputs
 * @property {Witness[]} scripts
 */

export const serialize = {
  attribute: serializeTransactionAttribute,
  input: serializeTransactionInput,
  output: serializeTransactionOutput,
  script: serializeWitness,
  exclusiveData: {
    128: (tx) => { return '' }
  }
}

export const deserialize = {
  attribute: deserializeTransactionAttribute,
  input: deserializeTransactionInput,
  output: deserializeTransactionOutput,
  script: deserializeWitness,
  exclusiveData: {
    128: () => { return {} }
  }
}

/**
 * Serializes a given transaction object
 * @param {Transaction} tx
 * @returns {string} Hexstring of transaction
 */
export const serializeTransaction = (tx) => {
  let out = ''
  out += num2hexstring(tx.type)
  out += num2hexstring(tx.version)
  out += serialize.exclusiveData[tx.type](tx)
  out += num2VarInt(tx.attributes.length)
  for (const attribute of tx.attributes) {
    out += serialize.attribute(attribute)
  }
  out += num2VarInt(tx.inputs.length)
  for (const input of tx.inputs) {
    out += serialize.input(input)
  }
  out += num2VarInt(tx.outputs.length)
  for (const output of tx.outputs) {
    out += serialize.output(output)
  }
  if (tx.scripts) {
    out += num2VarInt(tx.scripts.length)
    for (const script of tx.scripts) {
      out += serialize.script(script)
    }
  }
  return out
}

/**
 * Deserializes a given string into a Transaction object
 * @param {string} data - Serialized string
 * @returns {Transaction} Transaction Object
 */
export const deserializeTransaction = (data) => {
  const ss = new StringStream(data)
  let tx = {}
  tx.type = parseInt(ss.read(1), 16)
  tx.version = parseInt(ss.read(1), 16)
  tx.data = deserialize.exclusiveData[tx.type](ss)
  tx.attributes = []
  tx.inputs = []
  tx.outputs = []
  tx.scripts = []
  const attrLength = ss.readVarInt()
  for (let i = 0; i < attrLength; i++) {
    tx.inputs.push(deserialize.attribute(ss))
  }
  const inputLength = ss.readVarInt()
  for (let i = 0; i < inputLength; i++) {
    tx.inputs.push(deserialize.input(ss))
  }
  const outputLength = ss.readVarInt()
  for (let i = 0; i < outputLength; i++) {
    tx.outputs.push(deserialize.output(ss))
  }
  if (!ss.isEmpty()) {
    const scriptLength = ss.readVarInt()
    for (let i = 0; i < scriptLength; i++) {
      tx.scripts.push(deserialize.script(ss))
    }
  }
  return tx
}