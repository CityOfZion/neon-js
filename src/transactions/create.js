import { createSignatureScript, getHash } from '../wallet.js'

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
    scriptHash: getHash(createSignatureScript(publicKey))
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
  const requiredAssets = intents.reduce((assets, intent) => {
    assets[intent.assetId] ? assets[intent.assetId] += intent.value : assets[intent.assetId] = intent.value
    return assets
  }, {})
  let change = []
  const inputs = Object.keys(requiredAssets).map((assetId) => {
    const requiredAmt = requiredAssets[assetId]
    const assetBalance = balances[ASSETS[assetId]]
    if (assetBalance.balance < requiredAmt) throw new Error(`Insufficient ${ASSETS[assetId]}! Need ${requiredAmt} but only found ${assetBalance.balance}`)
    // Ascending order sort
    assetBalance.unspent.sort((a, b) => a.value - b.value)
    let selectedInputs = 0
    let selectedAmt = 0
    // Selected min inputs to satisfy outputs
    while (selectedAmt < requiredAmt) {
      selectedInputs += 1
      selectedAmt += assetBalance.unspent[selectedInputs - 1].value
    }
    // Construct change output
    if (selectedAmt > requiredAmt) {
      change.push({
        assetId,
        value: selectedAmt - requiredAmt,
        scriptHash: getHash(createSignatureScript(publicKey))
      })
    }
    // Format inputs
    return assetBalance.unspent.slice(0, selectedInputs).map((input) => {
      return { prevHash: input.txid, prevIndex: input.index }
    })
  }).reduce((prev, curr) => prev.concat(curr), [])
  return Object.assign(tx, { inputs, attributes, outputs: intents.concat(change) }, override)
}
