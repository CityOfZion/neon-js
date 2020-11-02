import * as nep5 from "./nep5";
import { wallet } from "@cityofzion/neon-core";
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

export interface CommonConfig {
  networkMagic: number;
  rpcAddress: string;
  prioritisationFee?: number;
  blocksTillExpiry?: number;
  account?: wallet.Account;
}

export { nep5, txHelpers, deployContract };
