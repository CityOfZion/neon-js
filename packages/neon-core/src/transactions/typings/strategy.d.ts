import { AssetBalance, Coin } from '../../wallet';
import { Fixed8 } from '../../utils';

export function smallestFirst(assetBalance: AssetBalance, requiredAmt: Fixed8): Coin[]

export function biggestFirst(assetBalance: AssetBalance, requiredAmt: Fixed8): Coin[]

export function balancedApproach(assetBalance: AssetBalance, requiredAmt: Fixed8): Coin[]
