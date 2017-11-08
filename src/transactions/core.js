import { num2VarInt, num2hexstring, StringStream, reverseHex, hash256 } from '../utils'
import { generateSignature, getVerificationScriptFromPublicKey, getPublicKeyFromPrivateKey } from '../wallet'
import { serialize as serialiseExclusive, deserialize as deserializeExclusive } from './exclusive'
import * as comp from './components'

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
  out += serialiseExclusive[tx.type](tx)
  out += num2VarInt(tx.attributes.length)
  for (const attribute of tx.attributes) {
    out += comp.serializeTransactionAttribute(attribute)
  }
  out += num2VarInt(tx.inputs.length)
  for (const input of tx.inputs) {
    out += comp.serializeTransactionInput(input)
  }
  out += num2VarInt(tx.outputs.length)
  for (const output of tx.outputs) {
    out += comp.serializeTransactionOutput(output)
  }
  if (signed && tx.scripts && tx.scripts.length > 0) {
    out += num2VarInt(tx.scripts.length)
    for (const script of tx.scripts) {
      out += comp.serializeWitness(script)
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
  const exclusiveData = deserializeExclusive[tx.type](ss)
  tx.attributes = []
  tx.inputs = []
  tx.outputs = []
  tx.scripts = []
  const attrLength = ss.readVarInt()
  for (let i = 0; i < attrLength; i++) {
    tx.inputs.push(comp.deserializeTransactionAttribute(ss))
  }
  const inputLength = ss.readVarInt()
  for (let i = 0; i < inputLength; i++) {
    tx.inputs.push(comp.deserializeTransactionInput(ss))
  }
  const outputLength = ss.readVarInt()
  for (let i = 0; i < outputLength; i++) {
    tx.outputs.push(comp.deserializeTransactionOutput(ss))
  }
  if (!ss.isEmpty()) {
    const scriptLength = ss.readVarInt()
    for (let i = 0; i < scriptLength; i++) {
      tx.scripts.push(comp.deserializeWitness(ss))
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
