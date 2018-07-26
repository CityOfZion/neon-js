import { Fixed8 } from "../u";
import AssetBalance from "../wallet/components/AssetBalance";
import Coin from "../wallet/components/Coin";
export declare type calculationStrategyFunction = (assetBalance: AssetBalance, requiredAmt: Fixed8) => Coin[];
/**
 * Select the coins in order of value, smallest first.
 * @param {AssetBalance} assetBalance
 * @param {Fixed8} requiredAmt
 * @return {Coin[]}
 */
export declare function smallestFirst(assetBalance: AssetBalance, requiredAmt: Fixed8): Coin[];
/**
 * Select the coins in order of value, biggest first.
 * @param {AssetBalance} assetBalance
 * @param {Fixed8} requiredAmt
 * @return {Coin[]}
 */
export declare function biggestFirst(assetBalance: AssetBalance, requiredAmt: Fixed8): Coin[];
/**
 * Use a balanced approach by selecting a coin that
 * @param {AssetBalance} assetBalance
 * @param {Fixed8} requiredAmt
 * @return {Coin[]}
 */
export declare function balancedApproach(assetBalance: AssetBalance, requiredAmt: Fixed8): Coin[];
//# sourceMappingURL=strategy.d.ts.map