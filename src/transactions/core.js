import { num2VarInt, num2hexstring, StringStream, reverseHex, hash256, Fixed8 } from '../utils'
import { Account, generateSignature, getVerificationScriptFromPublicKey, getPublicKeyFromPrivateKey, getScriptHashFromAddress, isPrivateKey } from '../wallet'
import { serializeExclusive, deserializeExclusive } from './exclusive'
import { ASSETS, ASSET_ID } from '../consts'
import * as comp from './components'
import logger from '../logging'

const log = logger('tx')

/**
 * Calculate the inputs required given the intents and gasCost. gasCost has to be seperate because it will not be reflected as an TransactionOutput.
 * @param {Balance} balances - Balance of all assets available.
 * @param {TransactionOutput[]} intents - All sending intents
 * @param {number|Fixed8} gasCost - gasCost required for the transaction.
 * @return {object} {inputs: TransactionInput[], change: TransactionOutput[] }
 */
export const calculateInputs = (balances, intents, gasCost = 0) => {
  if (intents === null) intents = []
  const requiredAssets = intents.reduce((assets, intent) => {
    assets[intent.assetId] ? assets[intent.assetId] = assets[intent.assetId].add(intent.value) : assets[intent.assetId] = intent.value
    return assets
  }, {})
  // Add GAS cost in
  gasCost = new Fixed8(gasCost)
  if (gasCost.gt(0)) {
    if (requiredAssets[ASSET_ID.GAS]) {
      requiredAssets[ASSET_ID.GAS] = requiredAssets[ASSET_ID.GAS].add(gasCost)
    } else {
      requiredAssets[ASSET_ID.GAS] = gasCost
    }
  }
  const inputsAndChange = Object.keys(requiredAssets).map((assetId) => {
    const requiredAmt = requiredAssets[assetId]
    const assetSymbol = ASSETS[assetId]
    if (balances.assetSymbols.indexOf(assetSymbol) === -1) throw new Error(`This balance does not contain any ${assetSymbol}!`)
    const assetBalance = balances.assets[assetSymbol]
    if (assetBalance.balance.lt(requiredAmt)) throw new Error(`Insufficient ${ASSETS[assetId]}! Need ${requiredAmt.toString()} but only found ${assetBalance.balance.toString()}`)
    return calculateInputsForAsset(assetBalance, requiredAmt, assetId, balances.address)
  })

  const output = inputsAndChange.reduce((prev, curr) => {
    return {
      inputs: prev.inputs.concat(curr.inputs),
      change: prev.change.concat(curr.change)
    }
  }, { inputs: [], change: [] })
  return output
}

const calculateInputsForAsset = (assetBalance, requiredAmt, assetId, address) => {
  // Ascending order sort
  assetBalance.unspent.sort((a, b) => a.value.sub(b.value))
  let selectedInputs = 0
  let selectedAmt = new Fixed8(0)
  // Selected min inputs to satisfy outputs
  while (selectedAmt.lt(requiredAmt)) {
    selectedInputs += 1
    if (selectedInputs > assetBalance.unspent.length) throw new Error(`Insufficient ${ASSETS[assetId]}! Reached end of unspent coins! ${assetBalance.unspent.length}`)
    selectedAmt = selectedAmt.add(assetBalance.unspent[selectedInputs - 1].value)
  }
  const change = []
  // Construct change output
  if (selectedAmt.gt(requiredAmt)) {
    change.push({
      assetId,
      value: selectedAmt.sub(requiredAmt),
      scriptHash: getScriptHashFromAddress(address)
    })
  }
  // Format inputs
  const inputs = assetBalance.unspent.slice(0, selectedInputs).map((input) => {
    return { prevHash: input.txid, prevIndex: input.index }
  })
  return { inputs, change }
}
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
  out += serializeExclusive[tx.type](tx)
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
 * @returns {Transaction} Transaction object
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
    tx.attributes.push(comp.deserializeTransactionAttribute(ss))
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
 * @param {Transaction} transaction - Transaction as an object
 * @param {string} privateKey - The private key. This method does not check if the private key is valid (aka that the inputs come from the corresponding address)
 * @return {Transaction} Signed transaction as an object.
 */
export const signTransaction = (transaction, privateKey) => {
  if (!isPrivateKey(privateKey)) throw new Error('Key provided does not look like a private key!')
  const acct = new Account(privateKey)
  const invocationScript = '40' + generateSignature(serializeTransaction(transaction, false), privateKey)
  const verificationScript = getVerificationScriptFromPublicKey(getPublicKeyFromPrivateKey(privateKey))
  const witness = { invocationScript, verificationScript }
  transaction.scripts ? transaction.scripts.push(witness) : transaction.scripts = [witness]
  log.info(`Signed tx ${transaction.hash} with Account[${acct.address}]`)
  return transaction
}

/**
 * @param {Transaction} transaction
 * @return {string}
 */
export const getTransactionHash = (transaction) => {
  return reverseHex(hash256(serializeTransaction(transaction, false)))
}
