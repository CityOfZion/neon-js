import { getScriptHashFromPublicKey, getScriptHashFromAddress, isAddress } from '../wallet'
import { TX_VERSION, ASSET_ID } from '../consts'
import { createScript } from '../sc'
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
  constructor ({ type = 128, version = TX_VERSION.CONTRACT, attributes = [], inputs = [], outputs = [], scripts = [], exclusive = {} }) {
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
   * Creates a ClaimTransaction with the given parameters.
   * @param {string} publicKeyOrAddress - Public key (Encoded form) or address
   * @param {Object} claimData - Claim Data provided by API
   * @param {Object} [override={}] - Optional overrides (eg. custom version)
   * @return {Transaction} Unsigned Transaction
   */
  static createClaimTx (publicKeyOrAddress, claimData, override = {}) {
    const txConfig = Object.assign({
      type: 2,
      version: TX_VERSION.CLAIM
    }, override)
    let totalClaim = 0
    let maxClaim = 255
    const claims = claimData.claims.slice(0, maxClaim).map((c) => {
      totalClaim += c.claim
      return { prevHash: c.txid, prevIndex: c.index }
    })
    txConfig.outputs = [{
      assetId: ASSET_ID.GAS,
      value: totalClaim / 100000000,
      scriptHash: isAddress(publicKeyOrAddress) ? getScriptHashFromAddress(publicKeyOrAddress) : getScriptHashFromPublicKey(publicKeyOrAddress)
    }]
    return new Transaction(Object.assign(txConfig, { exclusive: claims }, override))
  }

  /**
   * Creates a ContractTransaction with the given parameters.
   * @param {Balance} balances - Current assets available.
   * @param {TransactionOutput[]} intents - All sending intents as TransactionOutputs
   * @param {Object} [override={}] - Optional overrides (eg.custom versions)
   * @return {Transaction} Unsigned Transaction
   */
  static createContractTx (balances, intents, override = {}) {
    const txConfig = Object.assign({
      type: 128,
      version: TX_VERSION.CONTRACT
    }, override)
    let { inputs, change } = core.calculateInputs(balances, intents)
    return new Transaction(Object.assign(txConfig, { inputs, outputs: intents.concat(change) }, override))
  }

  /**
   * Creates an InvocationTransaction with the given parameters.
   * @param {Balance} balances - Balance of address
   * @param {TransactionOutput[]} intents - Sending intents as transactionOutputs
   * @param {Object|string} invoke - Invoke Script as an object or hexstring
   * @param {number} gasCost - Gas to attach for invoking script
   * @param {Object} [override={}] - Optional overrides (eg.custom versions)
   * @return {string} Unsigned Transaction
   */
  static createInvocationTx (balances, intents, invoke, gasCost, override = {}) {
    const txConfig = Object.assign({
      type: 209,
      version: TX_VERSION.INVOCATION
    }, override)
    const { inputs, change } = core.calculateInputs(balances, intents, gasCost)
    const script = typeof (invoke) === 'string' ? invoke : createScript(invoke)
    return new Transaction(Object.assign(txConfig, { inputs, outputs: intents.concat(change), script, gas: gasCost }, override))
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
