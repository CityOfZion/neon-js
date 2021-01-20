import { u, wallet } from "@cityofzion/neon-core";
export interface CommonConfig {
  networkMagic: number;
  rpcAddress: string;
  prioritisationFee?: number;
  blocksTillExpiry?: number;
  account?: wallet.Account;

  networkFeeOverride?: u.BigInteger;
  systemFeeOverride?: u.BigInteger;
}
