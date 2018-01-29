import { Account } from '../wallet'
import { TX_VERSION, ASSET_ID } from '../consts'
import { createScript } from '../sc'
import { Fixed8, str2hexstring } from '../utils'
import TxAttrUsage from './txAttrUsage'
import * as comp from './components'
import * as core from './core'
import * as exc from './exclusive'
import logger from '../logging'

const log = logger('tx')

/**
 * @class Transaction
 * @classdesc
 * Transactions are what you use to interact with the blockchain.
 * A transaction is made up of components found in the component file.
 * Besides those components which are found in every transaction, there are also special data that is unique to each transaction type. These 'exclusive' data can be found in the exclusive file.
 * This class is a wrapper around the various transaction building methods found in this folder.
 * @param {object} tx - A Transaction-like object.
 * @param {number} tx.type - Transaction type. Default is 128 (ContractTransaction).
 * @param {number} tx.version - Transaction version. Default is latest version for ContractTransaction.
 * @param {TransactionAttribute[]} tx.attributes - Transaction Attributes.
 * @param {TransactionInput[]} tx.inputs - Transaction Inputs.
 * @param {TransactionOutput[]} tx.outputs - Transaction Outputs.
 * @param {Witness[]} tx.scripts - Witnesses.
 */
class Transaction {
  constructor (tx = {}) {
    /** @type {number} */
    this.type = tx.type || 128

    /** @type {number} */
    this.version = tx.version || TX_VERSION.CONTRACT

    /** @type {TransactionAttribute[]} */
    this.attributes = tx.attributes || []

    /** @type {TransactionInput[]} */
    this.inputs = tx.inputs || []

    /** @type {TransactionOutput[]} */
    this.outputs = tx.outputs ? tx.outputs.map((tx) => comp.TransactionOutput(tx)) : []

    /** @type {Witness[]} */
    this.scripts = tx.scripts || []
    const exclusive = exc.getExclusive[this.type](tx)
    Object.keys(exclusive).map((k) => {
      this[k] = exclusive[k]
    })
  }

  /**
   * Exclusive Data
   * @type {Object}
   */
  get exclusiveData () {
    return exc.getExclusive[this.type](this)
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
    if (claimData.claims.length === 0) throw new Error('Useless transaction! There is no claims!')
    const acct = new Account(publicKeyOrAddress)
    const txConfig = Object.assign({
      type: 2,
      version: TX_VERSION.CLAIM
    }, override)
    let totalClaim = new Fixed8(0)
    let maxClaim = 255
    txConfig.claims = claimData.claims.slice(0, maxClaim).map((c) => {
      totalClaim = totalClaim.add(c.claim)
      return { prevHash: c.txid, prevIndex: c.index }
    })
    txConfig.outputs = [{
      assetId: ASSET_ID.GAS,
      value: totalClaim,
      scriptHash: acct.scriptHash
    }]

    const tx = new Transaction(Object.assign(txConfig, override))
    log.info(`New ClaimTransaction for ${acct.address}`)
    return tx
  }

  /**
   * Creates a ContractTransaction with the given parameters.
   * @param {Balance} balances - Current assets available.
   * @param {TransactionOutput[]} intents - All sending intents as TransactionOutputs
   * @param {Object} [override={}] - Optional overrides (eg.custom versions)
   * @return {Transaction} Unsigned Transaction
   */
  static createContractTx (balances, intents, override = {}) {
    if (intents === null) throw new Error('Useless transaction! You are not sending anything!')
    const txConfig = Object.assign({
      type: 128,
      version: TX_VERSION.CONTRACT,
      outputs: intents
    }, override)
    const tx = new Transaction(txConfig).calculate(balances)
    log.info(`New ContractTransaction for ${balances.address}`)
    return tx
  }

  /**
   * Creates an InvocationTransaction with the given parameters.
   * @param {Balance} balances - Balance of address
   * @param {TransactionOutput[]} intents - Sending intents as transactionOutputs
   * @param {object|string} invoke - Invoke Script as an object or hexstring
   * @param {number} gasCost - Gas to attach for invoking script
   * @param {object} [override={}] - Optional overrides (eg.custom versions)
   * @return {Transaction} Unsigned Transaction
   */
  static createInvocationTx (balances, intents, invoke, gasCost = 0, override = {}) {
    if (intents === null) intents = []
    const txConfig = Object.assign({
      type: 209,
      version: TX_VERSION.INVOCATION,
      outputs: intents,
      script: typeof (invoke) === 'string' ? invoke : createScript(invoke),
      gas: gasCost
    }, override)
    const tx = new Transaction(txConfig).calculate(balances)
    log.info(`New InvocationTransaction for ${balances.address}`)
    return tx
  }

  /**
   * Deserializes a hexstring into a Transaction object.
   * @param {string} hexstring - Hexstring of the transaction.
   * @return {Transaction}
   */
  static deserialize (hexstring) {
    const txObj = core.deserializeTransaction(hexstring)
    const exclusiveData = exc.getExclusive[txObj.type](txObj)
    return new Transaction(Object.assign(txObj, exclusiveData))
  }

  /**
   * Adds a TransactionOutput. TransactionOutput can be given as a TransactionOutput object or as human-friendly values. This is detected by the number of arguments provided.
   * @param {string|Object} assetSymOrTxOut - The symbol of the asset (eg NEO or GAS) or the TransactionOutput object.
   * @param {number} [value] - The value to send. Required if providing human-friendly values.
   * @param {string} [address] - The address to send to. Required if providing human-friendly values.
   * @return {Transaction} this
   */
  addOutput (assetSymOrTxOut, value, address) {
    if (arguments.length === 3) {
      this.outputs.push(comp.createTransactionOutput(assetSymOrTxOut, value, address))
    } else if (typeof (arguments[0]) === 'object') {
      this.outputs.push(arguments[0])
    } else throw new Error('Invalid input given! Give either 1 or 3 arguments!')
    return this
  }

  /**
   * Add an attribute.
   * @param {number} usage - The usage type. Do refer to txAttrUsage enum values for all available options.
   * @param {string} data - The data as hexstring.
   */
  addAttribute (usage, data) {
    if (typeof data !== 'string') throw new TypeError('data should be formatted as string!')
    this.attributes.push({
      usage,
      data
    })
    return this
  }
  /**
   * Add a remark.
   * @param {string} remark - A remark in ASCII.
   * @return {Transaction} this
   */
  addRemark (remark) {
    const hexRemark = str2hexstring(remark)
    return this.addAttribute(TxAttrUsage.Remark, hexRemark)
  }

  /**
   * Calculate the inputs required based on existing outputs provided. Also takes into account the fees required through the gas property.
   * @param {Balance} balance - Balance to retrieve inputs from.
   * @return {Transaction} this
   */
  calculate (balance) {
    const { inputs, change } = core.calculateInputs(balance, this.outputs, this.gas)
    this.inputs = inputs
    this.outputs = this.outputs.concat(change)
    balance.applyTx(this)
    log.info(`Calculated the inputs required for Transaction with Balance: ${balance.address}`)
    return this
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
    return exc.serializeExclusive[this.type](this)
  }

  /**
   * Signs a transaction.
   * @param {Account|string} signer - Account, privateKey or WIF
   * @return {Transaction} this
   */
  sign (signer) {
    if (typeof signer === 'string') {
      signer = new Account(signer)
    }
    core.signTransaction(this, signer.privateKey)
    log.info(`Signed Transaction with Account: ${signer.label}`)
    return this
  }
}

export default Transaction
