import Tx from './transaction'
import * as core from './core'
import * as comp from './components'
import * as e from './exclusive'
import * as calculationStrategy from './strategy'
import TxAttrUsage from './txAttrUsage'

/**
 * NEO's default Endianness from RPC calls is Little Endian.
 * However, we will store our data in Big Endian unless stated.
 * This helps us in utilising the data we have in terms of displaying
 * and makes it easy to interact with other tools (eg pasting into block explorer)
 */

const create = {
  tx: (...args) => new Tx(...args),
  claimTx: Tx.createClaimTx,
  contractTx: Tx.createContractTx,
  invocationTx: Tx.createInvocationTx
}

const serialize = {
  attribute: comp.serializeTransactionAttribute,
  input: comp.serializeTransactionInput,
  output: comp.serializeTransactionOutput,
  script: comp.serializeWitness,
  exclusiveData: e.serializeExclusive,
  tx: core.serializeTransaction
}

const deserialize = {
  attribute: comp.deserializeTransactionAttribute,
  input: comp.deserializeTransactionInput,
  output: comp.deserializeTransactionOutput,
  script: comp.deserializeWitness,
  exclusiveData: e.deserializeExclusive,
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

export { Tx as Transaction, TxAttrUsage, calculationStrategy }
export * from './core'
export * from './components'
export * from './exclusive'
