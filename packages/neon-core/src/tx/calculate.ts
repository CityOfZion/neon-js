import { ASSET_ID, ASSETS } from "../consts";
import { Fixed8 } from "../u";
import { AssetBalance, Balance, getScriptHashFromAddress } from "../wallet";
import { TransactionInput, TransactionOutput } from "./components";
import { balancedApproach, calculationStrategyFunction } from "./strategy";

//eslint-disable-next-line
export let defaultCalculationStrategy = balancedApproach;

/**
 * Helper function that reduces a list of TransactionOutputs to a object of assetSymbol: amount.
 * This is useful during the calculations as we just need to know much of an asset we need.
 * @param intents List of TransactionOutputs to reduce.
 */
export function combineIntents(
  intents: TransactionOutput[]
): Record<string, Fixed8> {
  return intents.reduce((assets, intent) => {
    assets[intent.assetId]
      ? (assets[intent.assetId] = assets[intent.assetId].add(intent.value))
      : (assets[intent.assetId] = intent.value);
    return assets;
  }, {} as Record<string, Fixed8>);
}

export function calculateInputsForAsset(
  assetBalance: AssetBalance,
  requiredAmt: Fixed8,
  assetId: string,
  address: string,
  strategy: calculationStrategyFunction
): { inputs: TransactionInput[]; change: TransactionOutput[] } {
  const selectedInputs = strategy(assetBalance, requiredAmt);
  const selectedAmt = selectedInputs.reduce(
    (prev, curr) => prev.add(curr.value),
    new Fixed8(0)
  );
  const change: TransactionOutput[] = [];
  // Construct change output
  if (selectedAmt.gt(requiredAmt)) {
    change.push(
      new TransactionOutput({
        assetId,
        value: selectedAmt.sub(requiredAmt),
        scriptHash: getScriptHashFromAddress(address),
      })
    );
  }
  // Format inputs
  const inputs = selectedInputs.map((input) => {
    return new TransactionInput({
      prevHash: input.txid,
      prevIndex: input.index,
    });
  });
  return { inputs, change };
}

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
export function calculateInputs(
  balances: Balance,
  intents: TransactionOutput[] = [],
  fees: Fixed8 | number = 0,
  strategy?: calculationStrategyFunction
): { inputs: TransactionInput[]; change: TransactionOutput[] } {
  const chosenStrategy = strategy || defaultCalculationStrategy;
  const fixed8Fees = new Fixed8(fees);
  if (fixed8Fees.gt(0)) {
    intents = intents.slice();
    intents.push(
      new TransactionOutput({
        assetId: ASSET_ID.GAS,
        value: fees,
        scriptHash: getScriptHashFromAddress(balances.address),
      })
    );
  }

  const requiredAssets = combineIntents(intents);
  const inputsAndChange = Object.keys(requiredAssets).map((assetId) => {
    const requiredAmt = requiredAssets[assetId];
    const assetSymbol = ASSETS[assetId];
    if (balances.assetSymbols.indexOf(assetSymbol) === -1) {
      throw new Error(`This balance does not contain any ${assetSymbol}!`);
    }
    const assetBalance = balances.assets[assetSymbol];
    if (assetBalance.balance.lt(requiredAmt)) {
      throw new Error(
        `Insufficient ${
          ASSETS[assetId]
        }! Need ${requiredAmt.toString()} but only found ${assetBalance.balance.toString()}`
      );
    }
    return calculateInputsForAsset(
      new AssetBalance(assetBalance),
      requiredAmt,
      assetId,
      balances.address,
      chosenStrategy
    );
  });

  const output = inputsAndChange.reduce(
    (prev, curr) => {
      return {
        inputs: prev.inputs.concat(curr.inputs),
        change: prev.change.concat(curr.change),
      };
    },
    { inputs: [], change: [] }
  );
  return output;
}
