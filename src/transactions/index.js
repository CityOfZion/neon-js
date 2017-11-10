import Tx from './transaction'
import * as core from './core'
import * as comp from './components'
import * as e from './exclusive'

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
  claim: Tx.createClaimTx,
  contract: Tx.createContractTx,
  invocation: Tx.createInvocationTx
}

const serialize = {
  attribute: comp.serializeTransactionAttribute,
  input: comp.serializeTransactionInput,
  output: comp.serializeTransactionOutput,
  script: comp.serializeWitness,
  exclusiveData: e.serialize,
  tx: core.serializeTransaction
}

const deserialize = {
  attribute: comp.deserializeTransactionAttribute,
  input: comp.deserializeTransactionInput,
  output: comp.deserializeTransactionOutput,
  script: comp.deserializeWitness,
  exclusiveData: e.deserialize,
  tx: core.deserializeTransaction
}

export default {
  create,
  serialize,
  deserialize,
  get: {
    transactionHash: core.getTransactionHash
  },
  sign: {
    transaction: core.signTransaction
  }
}

export { Tx as Transaction }
export * from './core'
export * from './components'
export * from './exclusive'
