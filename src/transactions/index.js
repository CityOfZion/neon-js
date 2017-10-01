import { num2hexstring, ab2hexstring, StringStream, reverseHex, numStoreInMemory } from '../utils.js'

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
 * @property {ArrayBuffer} data - Data
 */

const serializeTransactionAttribute = (output) => {
  //TODO
  return
}

const deserializeTransactionAttribute = (stream) => {
  //TODO
  return
}

/**
 * @typedef Witness
 * @property {string} invocationScript
 * @property {string} verificationScript
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
  scripts: serializeWitness,
  exclusiveData: {
    128: (tx) => { return '' }
  }
}

export const deserialize = {
  attribute: deserializeTransactionAttribute,
  input: deserializeTransactionInput,
  output: deserializeTransactionOutput,
  scripts: deserializeWitness,
  exclusiveData: {
    128: () => { return null }
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
  out += num2hexstring(tx.attributes.length)
  for (const attribute of tx.attributes) {
    out += serialize.attribute(attribute)
  }
  out += num2hexstring(tx.inputs.length)
  for (const input of tx.inputs) {
    out += serialize.input(input)
  }
  out += num2hexstring(tx.outputs.length)
  for (const output of tx.outputs) {
    out += serialize.output(output)
  }
  if (tx.scripts) {
    out += num2hexstring(tx.scripts.length)
    for (const script of tx.scripts) {
      out += serialize.witness(script)
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

}