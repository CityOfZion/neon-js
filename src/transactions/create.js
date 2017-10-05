import { getScriptHashFromPublicKey } from '../wallet.js'
import { buildScript } from '../sc/scriptBuilder.js'

export const CURRENT_VERSION = 0
const ASSETS = {
  'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b': 'NEO',
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': 'GAS'
}

/**
 * Constructs a ClaimTransaction based on the inputs
 * @param {string} publicKey - Public key (Encoded form)
 * @param {Object} claimData - Claim Data provided by API
 * @param {Object} [override={}] - Optional overrides (eg. custom version)
 * @return {Transaction} Unsigned Transaction
 */
export const claimTx = (publicKey, claimData, override = {}) => {
  const tx = Object.assign({
    type: 2,
    version: CURRENT_VERSION,
    scripts: []
  }, override)
  const inputs = []
  const attributes = []
  let totalClaim = 0
  const claims = claimData.claims.map((c) => {
    totalClaim += c.claim
    return { prevHash: c.txid, prevIndex: c.index }
  })
  const outputs = [{
    assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
    value: totalClaim,
    scriptHash: getScriptHashFromPublicKey(publicKey)
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
export const ContractTx = (publicKey, balances, intents, override) => {
  const tx = Object.assign({
    type: 128,
    version: CURRENT_VERSION,
    scripts: []
  }, override)
  const attributes = []
  let { inputs, change } = calculateInputs(publicKey, balances, intents)
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
export const invocationTx = (publicKey, balances, intents, invoke, gasCost, override) => {
  const tx = Object.assign({
    type: 209,
    version: CURRENT_VERSION,
    scripts: []
  }, override)
  const attributes = []
  const { inputs, change } = calculateInputs(publicKey, balances, intents, gasCost)
  const script = typeof (invoke) === 'string' ? invoke : buildScript(invoke)
  return Object.assign(tx, { inputs, attributes, outputs: intents.concat(change), script, gas: gasCost }, override)
}

const calculateInputs = (publicKey, balances, intents, gasCost = 0) => {
  // We will work in Fixed8 notation here
  const requiredAssets = intents.reduce((assets, intent) => {
    const fixed8Value = Math.floor(intent.value * 100000000)
    if (assets[intent.assetId]) {
      assets[intent.assetId] += fixed8Value
    } else {
      assets[intent.assetId] = fixed8Value
    }
    return assets
  }, {})
  // Add GAS cost in
  if (gasCost > 0) {
    requiredAssets['602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'] ? requiredAssets['602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'] += gasCost * 100000000 : requiredAssets['602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7'] = gasCost * 100000000
  }
  let change = []
  const inputs = Object.keys(requiredAssets).map((assetId) => {
    const requiredAmt = requiredAssets[assetId]
    const assetBalance = balances[ASSETS[assetId]]
    if (assetBalance.balance * 100000000 < requiredAmt) throw new Error(`Insufficient ${ASSETS[assetId]}! Need ${requiredAmt} but only found ${assetBalance.balance}`)
    // Ascending order sort
    assetBalance.unspent.sort((a, b) => a.value - b.value)
    let selectedInputs = 0
    let selectedAmt = 0
    // Selected min inputs to satisfy outputs
    while (selectedAmt < requiredAmt) {
      selectedInputs += 1
      selectedAmt += Math.floor(assetBalance.unspent[selectedInputs - 1].value * 100000000)
    }
    // Construct change output
    if (selectedAmt > requiredAmt) {
      change.push({
        assetId,
        value: (selectedAmt - requiredAmt) / 100000000,
        scriptHash: getScriptHashFromPublicKey(publicKey)
      })
    }
    // Format inputs
    return assetBalance.unspent.slice(0, selectedInputs).map((input) => {
      return { prevHash: input.txid, prevIndex: input.index }
    })
  }).reduce((prev, curr) => prev.concat(curr), [])
  return { inputs, change }
}
