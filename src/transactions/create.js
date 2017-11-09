import { getScriptHashFromPublicKey, getScriptHashFromAddress, isAddress } from '../wallet'
import { createScript } from '../sc'
import { TX_VERSION, ASSETS, ASSET_ID } from '../consts'

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
  let { inputs, change } = calculateInputs(balances, intents)
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
  const { inputs, change } = calculateInputs(balances, intents, gasCost)
  const script = typeof (invoke) === 'string' ? invoke : createScript(invoke)
  return Object.assign(tx, { inputs, attributes, outputs: intents.concat(change), script, gas: gasCost }, override)
}

/**
 * Calculate the inputs required given the intents and gasCost. gasCost has to be seperate because it will not be reflected as an TransactionOutput.
 * @param {Balance} balances - Balance of all assets available.
 * @param {TransactionOutput[]} intents - All sending intents
 * @param {number} gasCost - gasCost required for the transaction.
 * @return {Object} {inputs: TransactionInput[], change: TransactionOutput[] }
 */
export const calculateInputs = (balances, intents, gasCost = 0) => {
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
    requiredAssets[ASSET_ID.GAS] ? requiredAssets[ASSET_ID.GAS] += fixed8GasCost : requiredAssets[ASSET_ID.GAS] = fixed8GasCost
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
