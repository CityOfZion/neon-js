import { getScriptHashFromPublicKey } from '../wallet'
import { createScript } from '../sc'

export const CURRENT_VERSION = 0
export const ASSETS = {
  'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b': 'NEO',
  '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7': 'GAS',
  'GAS': '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
  'NEO': 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b'
}

/**
 * Constructs a ClaimTransaction based on the inputs
 * @param {string} publicKey - Public key (Encoded form)
 * @param {Object} claimData - Claim Data provided by API
 * @param {Object} [override={}] - Optional overrides (eg. custom version)
 * @return {Transaction} Unsigned Transaction
 */
export const createClaimTx = (publicKey, claimData, override = {}) => {
  const tx = Object.assign({
    type: 2,
    version: CURRENT_VERSION,
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
    assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
    value: totalClaim / 100000000,
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
export const createContractTx = (publicKey, balances, intents, override = {}) => {
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
export const createInvocationTx = (publicKey, balances, intents, invoke, gasCost, override = {}) => {
  const tx = Object.assign({
    type: 209,
    version: CURRENT_VERSION,
    scripts: []
  }, override)
  const attributes = []
  const { inputs, change } = calculateInputs(publicKey, balances, intents, gasCost)
  const script = typeof (invoke) === 'string' ? invoke : createScript(invoke)
  return Object.assign(tx, { inputs, attributes, outputs: intents.concat(change), script, gas: gasCost }, override)
}

/**
 * Calculate the inputs required given the intents and gasCost. gasCost has to be seperate because it will not be reflected as an TransactionOutput.
 * @param {string} publicKey
 * @param {Balance} balances - Balance of all assets available.
 * @param {TransactionOutput[]} intents - All sending intents
 * @param {number} gasCost - gasCost required for the transaction.
 * @return {Object} {inputs: TransactionInput[], change: TransactionOutput[] }
 */
const calculateInputs = (publicKey, balances, intents, gasCost = 0) => {
  // We will work in integers here to be more accurate.
  // As assets are stored as Fixed8, we just multiple everything by 10e8 and round off to get integers.
  const requiredAssets = intents.reduce((assets, intent) => {
    const fixed8Value = Math.round(intent.value * 100000000)
    assets[intent.assetId] ? assets[intent.assetId] += fixed8Value : assets[intent.assetId] = fixed8Value
    return assets
  }, {})
  // Add GAS cost in
  if (gasCost > 0) {
    const fixed8GasCost = gasCost * 100000000
    requiredAssets[ASSETS.GAS] ? requiredAssets[ASSETS.GAS] += fixed8GasCost : requiredAssets[ASSETS.GAS] = fixed8GasCost
  }
  let change = []
  const inputs = Object.keys(requiredAssets).map((assetId) => {
    const requiredAmt = requiredAssets[assetId]
    const assetBalance = balances[ASSETS[assetId]]
    if (assetBalance.balance * 100000000 < requiredAmt) throw new Error(`Insufficient ${ASSETS[assetId]}! Need ${requiredAmt / 100000000} but only found ${assetBalance.balance}`)
    // Ascending order sort
    assetBalance.unspent.sort((a, b) => a.value - b.value)
    let selectedInputs = 0
    let selectedAmt = 0
    // Selected min inputs to satisfy outputs
    while (selectedAmt < requiredAmt) {
      selectedInputs += 1
      selectedAmt += Math.round(assetBalance.unspent[selectedInputs - 1].value * 100000000)
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
