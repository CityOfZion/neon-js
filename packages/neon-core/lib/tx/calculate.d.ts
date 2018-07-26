import { Fixed8 } from "../u";
import { AssetBalance, Balance } from "../wallet";
import { TransactionInput, TransactionOutput } from "./components";
import { balancedApproach, calculationStrategyFunction } from "./strategy";
export declare let defaultCalculationStrategy: typeof balancedApproach;
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
export declare function calculateInputs(balances: Balance, intents?: TransactionOutput[], fees?: Fixed8 | number, strategy?: calculationStrategyFunction): {
    inputs: TransactionInput[];
    change: TransactionOutput[];
};
/**
 * Helper function that reduces a list of TransactionOutputs to a object of assetSymbol: amount.
 * This is useful during the calculations as we just need to know much of an asset we need.
 * @param intents List of TransactionOutputs to reduce.
 */
export declare function combineIntents(intents: TransactionOutput[]): {
    [assetId: string]: Fixed8;
};
export declare function calculateInputsForAsset(assetBalance: AssetBalance, requiredAmt: Fixed8, assetId: string, address: string, strategy: calculationStrategyFunction): {
    inputs: TransactionInput[];
    change: TransactionOutput[];
};
//# sourceMappingURL=calculate.d.ts.map