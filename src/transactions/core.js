import { num2VarInt, num2hexstring, StringStream, reverseHex, hash256 } from '../utils'
import { generateSignature, getVerificationScriptFromPublicKey, getPublicKeyFromPrivateKey, getScriptHashFromAddress } from '../wallet'
import { serializeExclusive, deserializeExclusive } from './exclusive'
import { ASSETS, ASSET_ID } from '../consts'
import * as comp from './components'

/**
 * Calculate the inputs required given the intents and gasCost. gasCost has to be seperate because it will not be reflected as an TransactionOutput.
 * @param {Balance} balances - Balance of all assets available.
 * @param {TransactionOutput[]} intents - All sending intents
 * @param {number} gasCost - gasCost required for the transaction.
 * @return {object} {inputs: TransactionInput[], change: TransactionOutput[] }
 */
export const calculateInputs = (balances, intents, gasCost = 0) => {
  // We will work in integers here to be more accurate.
  // As assets are stored as Fixed8, we just multiple everything by 10e8 and round off to get integers.
  if (intents === null) intents = []
  const requiredAssets = intents.reduce((assets, intent) => {
    const fixed8Value = Math.round(intent.value * 100000000)
    assets[intent.assetId] ? assets[intent.assetId] += fixed8Value : assets[intent.assetId] = fixed8Value
    return assets
  }, {})
  // Add GAS cost in
  if (gasCost > 0) {
    const fixed8GasCost = gasCost * 100000000
    requiredAssets[ASSET_ID.GAS] ? requiredAssets[ASSET_ID.GAS] += fixed8GasCost : requiredAssets[ASSET_ID.GAS] = fixed8GasCost
  }
  let change = []
  const inputs = Object.keys(requiredAssets).map((assetId) => {
    const requiredAmt = requiredAssets[assetId]
    const assetSymbol = ASSETS[assetId]
    if (balances.assetSymbols.indexOf(assetSymbol) === -1) throw new Error(`This balance does not contain any ${assetSymbol}!`)
    const assetBalance = balances.assets[assetSymbol]
    if (assetBalance.balance * 100000000 < requiredAmt) throw new Error(`Insufficient ${ASSETS[assetId]}! Need ${requiredAmt / 100000000} but only found ${assetBalance.balance}`)
    // Ascending order sort
    assetBalance.unspent.sort((a, b) => a.value - b.value)
    let selectedInputs = 0
    let selectedAmt = 0
    // Selected min inputs to satisfy outputs
    while (selectedAmt < requiredAmt) {
      selectedInputs += 1
      if (selectedInputs > assetBalance.unspent.length) throw new Error(`Insufficient ${ASSETS[assetId]}! Reached end of unspent coins!`)
      selectedAmt += Math.round(assetBalance.unspent[selectedInputs - 1].value * 100000000)
    }
    // Construct change output
    if (selectedAmt > requiredAmt) {
      change.push({
        assetId,
        value: (selectedAmt - requiredAmt) / 100000000,
        scriptHash: getScriptHashFromAddress(balances.address)
      })
    }
    // Format inputs
    return assetBalance.unspent.slice(0, selectedInputs).map((input) => {
      return { prevHash: input.txid, prevIndex: input.index }
    })
  }).reduce((prev, curr) => prev.concat(curr), [])
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
 * @param {Transaction} transaction - Transaction as an object
 * @param {string} privateKey - The private key. This method does not check if the private key is valid (aka that the inputs come from the corresponding address)
 * @return {Transaction} Signed transaction as an object.
 */
export const signTransaction = (transaction, privateKey) => {
  const invocationScript = '40' + generateSignature(serializeTransaction(transaction, false), privateKey)
  const verificationScript = getVerificationScriptFromPublicKey(getPublicKeyFromPrivateKey(privateKey))
  const witness = { invocationScript, verificationScript }
  transaction.scripts ? transaction.scripts.push(witness) : transaction.scripts = [witness]
  return transaction
}

/**
 * @param {Transaction} transaction
 * @return {string}
 */
export const getTransactionHash = (transaction) => {
  return reverseHex(hash256(serializeTransaction(transaction, false)))
}
