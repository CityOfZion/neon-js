import { TX_VERSION } from '../consts'
import * as comp from './components'
import * as core from './core'
import * as exc from './exclusive'

/**
 * @class Transaction
 * @classdesc
 * Transactions are what you use to interact with the blockchain.
 * A transaction is made up of components found in the component file.
 * Besides those components which are found in every transaction, there are also special data that is unique to each transaction type. These 'exclusive' data can be found in the exclusive file.
 * This class is a wrapper around the various transaction building methods found in this folder.
 */
class Transaction {
  constructor ({ type = 128, version = TX_VERSION, attributes = [], inputs = [], outputs = [], scripts = [], exclusive = {} }) {
    /** @type {number} */
    this.type = type

    /** @type {number} */
    this.version = version

    /** @type {TransactionAttribute[]} */
    this.attributes = attributes

    /** @type {TransactionInput[]} */
    this.inputs = inputs

    /** @type {TransactionOutput[]} */
    this.outputs = outputs

    /** @type {Witness[]} */
    this.scripts = scripts
    return Object.assign(this, exclusive)
  }

  /**
   * Exclusive Data
   * @type {Object}
   */
  get exclusiveData () {
    return exc.get[this.type](this)
  }

  /**
   * Transaction hash.
   * @type {string}
   */
  get hash () {
    return core.getTransactionHash(this)
  }

  /**
   * Deserializes a hexstring into a Transaction object.
   * @param {string} hexstring - Hexstring of the transaction.
   * @return {Transaction}
   */
  static deserialize (hexstring) {
    const txObj = core.deserializeTransaction(hexstring)
    const exclusiveData = exc.get[txObj.type](txObj)
    return new Transaction(Object.assign(txObj, { exclusive: exclusiveData }))
  }

  /**
   * Adds a TransactionOutput. TransactionOutput can be given as a TransactionOutput object or as human-friendly values. This is detected by the number of arguments provided.
   * @param {string|Object} assetSymOrTxOut - The symbol of the asset (eg NEO or GAS) or the TransactionOutput object.
   * @param {number} [value] - The value to send. Required if providing human-friendly values.
   * @param {string} [address] - The address to send to. Required if providing human-friendly values.
   */
  addOutput (assetSymOrTxOut, value, address) {
    if (arguments.length === 3) {
      this.outputs.push(comp.createTransactionOutput(assetSymOrTxOut, value, address))
    } else if (typeof (arguments[0]) === 'object') {
      this.outputs.push(arguments[0])
    } else throw new Error(`Invalid input given! Give either 1 or 3 arguments!`)
  }

  /**
   * Serialize the transaction and return it as a hexstring.
   * @param {boolean} signed  - Whether to serialize the signatures. Signing requires it to be serialized without the signatures.
   * @return {string} Hexstring.
   */
  serialize (signed = true) {
    return core.serializeTransaction(this, signed)
  }

  /**
   * Serializes the exclusive data in this transaction
   * @return {string} hexstring of the exclusive data
   */
  serializeExclusiveData () {
    return exc.serialize[this.type](this)
  }
}

export default Transaction
