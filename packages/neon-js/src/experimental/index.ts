import * as nep5 from "./nep5";
import { SmartContract } from "./contract";
import {
  getSystemFee,
  calculateNetworkFee,
  setBlockExpiry,
  addFees,
  deployContract,
} from "./helpers";

const txHelpers = {
  getSystemFee,
  calculateNetworkFee,
  setBlockExpiry,
  addFees,
};

export { nep5, txHelpers, deployContract, SmartContract };
