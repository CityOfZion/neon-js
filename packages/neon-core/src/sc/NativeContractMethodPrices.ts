import { Fixed8 } from "../u";

export const NativeContractMethodPrices = new Map<string, Fixed8>([
  ["getMaxTransactionsPerBlock", new Fixed8(1000000e-8)],
  ["getFeePerByte", new Fixed8(1000000e-8)],
  ["getBlockedAccounts", new Fixed8(1000000e-8)],
  ["setMaxTransactionsPerBlock", new Fixed8(3000000e-8)],
  ["setFeePerByte", new Fixed8(3000000e-8)],
  ["blockAccount", new Fixed8(3000000e-8)],
  ["unblockAccount", new Fixed8(3000000e-8)],
  ["supportedStandards", new Fixed8(0)],
  ["name", new Fixed8(0)],
  ["symbol", new Fixed8(0)],
  ["decimals", new Fixed8(0)],
  ["totalSupply", new Fixed8(1000000e-8)],
  ["balanceOf", new Fixed8(1000000e-8)],
  ["transfer", new Fixed8(8000000e-8)],
  ["getSysFeeAmount", new Fixed8(1000000e-8)],
  ["unclaimedGas", new Fixed8(3000000e-8)],
  ["registerValidator", new Fixed8(5000000e-8)],
  ["getRegisteredValidators", new Fixed8(1)],
  ["getValidators", new Fixed8(1)],
  ["getNextBlockValidators", new Fixed8(1)],
  ["vote", new Fixed8(5)]
]);

export default NativeContractMethodPrices;
