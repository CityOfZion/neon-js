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
  },
  sign: {
    transaction: signTransaction
  }
}

export * from './components'
export * from './create'
export * from './exclusive'
