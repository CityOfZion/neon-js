import { num2VarInt, num2hexstring, StringStream, reverseHex, hash256 } from '../utils'
import { generateSignature, getVerificationScriptFromPublicKey, getPublicKeyFromPrivateKey } from '../wallet'
import * as comp from './components'
import * as e from './exclusive'
import * as _c from './create'

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

/**
 * Serializes a given transaction object
 * @param {Transaction} tx
 * @param {boolean} signed - If the signatures should be serialized
 * @returns {string} Hexstring of transaction
 */
export const serializeTransaction = (tx, signed = true) => {
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
  if (signed && tx.scripts && tx.scripts.length > 0) {
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

/**
 * Signs a transaction with the corresponding privateKey. We are dealing with it as an Transaction object as multi-sig transactions require us to sign the transaction without signatures.
 * @param {Object} transaction - Transaction as an object
 * @param {string} privateKey - The private key. This method does not check if the private key is valid (aka that the inputs come from the corresponding address)
 * @return {Object} Signed transaction as an object.
 */
export const signTransaction = (transaction, privateKey) => {
  const invocationScript = '40' + generateSignature(serializeTransaction(transaction, false), privateKey)
  const verificationScript = getVerificationScriptFromPublicKey(getPublicKeyFromPrivateKey(privateKey))
  const witness = { invocationScript, verificationScript }
  transaction.scripts ? transaction.scripts.push(witness) : transaction.scripts = [witness]
  return transaction
}

/**
 * @param {Object} transaction
 * @return {string}
 */
export const getTransactionHash = (transaction) => {
  return reverseHex(hash256(serializeTransaction(transaction, false)))
}

const create = {
  claim: _c.createClaimTx,
  contract: _c.createContractTx,
  invocation: _c.createInvocationTx
}

const serialize = {
  attribute: comp.serializeTransactionAttribute,
  input: comp.serializeTransactionInput,
  output: comp.serializeTransactionOutput,
  script: comp.serializeWitness,
  exclusiveData: e.serialize,
  tx: serializeTransaction
}

const deserialize = {
  attribute: comp.deserializeTransactionAttribute,
  input: comp.deserializeTransactionInput,
  output: comp.deserializeTransactionOutput,
  script: comp.deserializeWitness,
  exclusiveData: e.deserialize,
  tx: deserializeTransaction
}

export default {
  create,
  serialize,
  deserialize,
  get: {
    transactionHash: getTransactionHash
  }
}

export * from './components'
export * from './create'
export * from './exclusive'
