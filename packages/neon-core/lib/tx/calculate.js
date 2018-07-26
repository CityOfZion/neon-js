"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../consts");
const u_1 = require("../u");
const wallet_1 = require("../wallet");
const components_1 = require("./components");
const strategy_1 = require("./strategy");
exports.defaultCalculationStrategy = strategy_1.balancedApproach;
/**
 * Calculate the inputs required given the intents and fees.
 * Fees are various GAS outputs that are not reflected as an TransactionOutput (absorbed by network).
 * This includes network fees, gas fees and transaction fees.
 * The change is automatically attributed to the incoming balance.
 * @param balances Balance of all assets available.
 * @param intents All sending intents.
 * @param fees gasCost required for the transaction.
 * @param strategy Calculation strategy to pick inputs.
 * @return Object with inputs and change.
 */
function calculateInputs(balances, intents = [], fees = 0, strategy) {
    const chosenStrategy = strategy || exports.defaultCalculationStrategy;
    const fixed8Fees = new u_1.Fixed8(fees);
    if (fixed8Fees.gt(0)) {
        intents = intents.slice();
        intents.push(new components_1.TransactionOutput({
            assetId: consts_1.ASSET_ID.GAS,
            value: fees,
            scriptHash: wallet_1.getScriptHashFromAddress(balances.address)
        }));
    }
    const requiredAssets = combineIntents(intents);
    const inputsAndChange = Object.keys(requiredAssets).map(assetId => {
        const requiredAmt = requiredAssets[assetId];
        const assetSymbol = consts_1.ASSETS[assetId];
        if (balances.assetSymbols.indexOf(assetSymbol) === -1) {
            throw new Error(`This balance does not contain any ${assetSymbol}!`);
        }
        const assetBalance = balances.assets[assetSymbol];
        if (assetBalance.balance.lt(requiredAmt)) {
            throw new Error(`Insufficient ${consts_1.ASSETS[assetId]}! Need ${requiredAmt.toString()} but only found ${assetBalance.balance.toString()}`);
        }
        return calculateInputsForAsset(new wallet_1.AssetBalance(assetBalance), requiredAmt, assetId, balances.address, chosenStrategy);
    });
    const output = inputsAndChange.reduce((prev, curr) => {
        return {
            inputs: prev.inputs.concat(curr.inputs),
            change: prev.change.concat(curr.change)
        };
    }, { inputs: [], change: [] });
    return output;
}
exports.calculateInputs = calculateInputs;
/**
 * Helper function that reduces a list of TransactionOutputs to a object of assetSymbol: amount.
 * This is useful during the calculations as we just need to know much of an asset we need.
 * @param intents List of TransactionOutputs to reduce.
 */
function combineIntents(intents) {
    return intents.reduce((assets, intent) => {
        assets[intent.assetId]
            ? (assets[intent.assetId] = assets[intent.assetId].add(intent.value))
            : (assets[intent.assetId] = intent.value);
        return assets;
    }, {});
}
exports.combineIntents = combineIntents;
function calculateInputsForAsset(assetBalance, requiredAmt, assetId, address, strategy) {
    const selectedInputs = strategy(assetBalance, requiredAmt);
    const selectedAmt = selectedInputs.reduce((prev, curr) => prev.add(curr.value), new u_1.Fixed8(0));
    const change = [];
    // Construct change output
    if (selectedAmt.gt(requiredAmt)) {
        change.push(new components_1.TransactionOutput({
            assetId,
            value: selectedAmt.sub(requiredAmt),
            scriptHash: wallet_1.getScriptHashFromAddress(address)
        }));
    }
    // Format inputs
    const inputs = selectedInputs.map(input => {
        return new components_1.TransactionInput({
            prevHash: input.txid,
            prevIndex: input.index
        });
    });
    return { inputs, change };
}
exports.calculateInputsForAsset = calculateInputsForAsset;
//# sourceMappingURL=calculate.js.map