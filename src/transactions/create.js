import { getScriptHashFromPublicKey, getScriptHashFromAddress, isAddress } from '../wallet'
import { createScript } from '../sc'
import { TX_VERSION, ASSET_ID } from '../consts'
import * as core from './core'

/**
 * Constructs a ClaimTransaction based on the inputs
 * @param {string} publicKeyOrAddress - Public key (Encoded form) or address
 * @param {Object} claimData - Claim Data provided by API
 * @param {Object} [override={}] - Optional overrides (eg. custom version)
 * @return {Transaction} Unsigned Transaction
 */
export const createClaimTx = (publicKeyOrAddress, claimData, override = {}) => {
  const tx = Object.assign({
    type: 2,
    version: TX_VERSION.CLAIM,
    scripts: []
  }, override)
  const inputs = []
  const attributes = []
  let totalClaim = 0
  // TODO: There is some limit in the number of claims we are allowed to attach.
  // Adding slice 100 here for now -- what limit does the protocol define?
  let maxClaim = 100
  const claims = claimData.claims.slice(0, maxClaim).map((c) => {
    totalClaim += c.claim
    return { prevHash: c.txid, prevIndex: c.index }
  })
  // TODO: probably have neon-wallet-db return human-readable numbers, if we are
  // going to end up dividing out here
  const outputs = [{
    assetId: ASSET_ID.GAS,
    value: totalClaim / 100000000,
    scriptHash: isAddress(publicKeyOrAddress) ? getScriptHashFromAddress(publicKeyOrAddress) : getScriptHashFromPublicKey(publicKeyOrAddress)
  }]
  return Object.assign(tx, { inputs, attributes, claims, outputs }, override)
}

/**
 * Constructs a ContractTransaction based on inputs.
 * @param {string} publicKey - Public Key (Encoded Form)
 * @param {Balance} balances - Current assets available.
 * @param {TransactionOutput[]} intents - All sending intents as TransactionOutputs
 * @param {Object} [override={}] - Optional overrides (eg.custom versions)
 * @return {Transaction} Unsigned Transaction
 */
export const createContractTx = (publicKey, balances, intents, override = {}) => {
  const tx = Object.assign({
    type: 128,
    version: TX_VERSION.CONTRACT,
    scripts: []
  }, override)
  const attributes = []
  let { inputs, change } = core.calculateInputs(balances, intents)
  return Object.assign(tx, { inputs, attributes, outputs: intents.concat(change) }, override)
}

/**
 * Constructs an invocationTransaction based on inputs
 * @param {string} publicKey - Public Key (Encoded Form)
 * @param {Balance} balances - Balance of address
 * @param {TransactionOutput[]} intents - Sending intents as transactionOutputs
 * @param {Object|string} invoke - Invoke Script as an object or hexstring
 * @param {number} gasCost - Gas to attach for invoking script
 * @param {Object} [override={}] - Optional overrides (eg.custom versions)
 * @return {string} Unsigned Transaction
 */
export const createInvocationTx = (publicKey, balances, intents, invoke, gasCost, override = {}) => {
  const tx = Object.assign({
    type: 209,
    version: TX_VERSION.INVOCATION,
    scripts: []
  }, override)
  const attributes = []
  const { inputs, change } = core.calculateInputs(balances, intents, gasCost)
  const script = typeof (invoke) === 'string' ? invoke : createScript(invoke)
  return Object.assign(tx, { inputs, attributes, outputs: intents.concat(change), script, gas: gasCost }, override)
}
