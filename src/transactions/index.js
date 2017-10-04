import { num2VarInt, num2hexstring, StringStream } from '../utils.js'
import * as comp from './components.js'
import * as e from './exclusive.js'
import * as _c from './create.js'

/**
 * NEO's default Endianness from RPC calls is Little Endian.
 * However, we will store our data in Big Endian unless stated.
 * This helps us in utilising the data we have in terms of displaying
 * and makes it easy to interact with other tools (eg pasting into block explorer)
 */

/**
 * @typedef Transaction
 * @property {number} type
 * @property {number} version
 * @property {TransactionAttribute[]} attributes
 * @property {TransactionInput[]} inputs
 * @property {TransactionOutput[]} outputs
 * @property {Witness[]} scripts
 */

export const create = {
  claim: _c.claimTx,
  contract: _c.ContractTx
}

export const serialize = {
  attribute: comp.serializeTransactionAttribute,
  input: comp.serializeTransactionInput,
  output: comp.serializeTransactionOutput,
  script: comp.serializeWitness,
  exclusiveData: e.serialize
}

export const deserialize = {
  attribute: comp.deserializeTransactionAttribute,
  input: comp.deserializeTransactionInput,
  output: comp.deserializeTransactionOutput,
  script: comp.deserializeWitness,
  exclusiveData: e.deserialize
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
  if (tx.scripts && tx.scripts.length > 0) {
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
  const exclusiveData = deserialize.exclusiveData[tx.type](ss)
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
  return Object.assign(tx, exclusiveData)
}
