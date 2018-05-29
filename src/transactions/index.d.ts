import { smallestFirst, biggestFirst, balancedApproach } from './typings/strategy';
import { AssetBalance, Coin } from '../wallet';
import { Fixed8 } from '../utils';

export * from './typings/components';
export * from './typings/core';
export * from './typings/exclusive';
export * from './typings/Transaction';
export * from './typings/txAttrUsage';

export type strategyFunction = (assetBalance: AssetBalance, requiredAmt: Fixed8) => Coin[]
export interface calculationStrategy {
  smallestFirst: strategyFunction,
  biggestFirst: strategyFunction,
  balancedApproach: strategyFunction
}
