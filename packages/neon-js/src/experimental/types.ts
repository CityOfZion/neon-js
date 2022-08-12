import { u, wallet } from "@cityofzion/neon-core";
export interface CommonConfig {
  networkMagic: number;
  rpcAddress: string;
  /**
   * Extra GAS added to the networkFee to prioritise the transaction in the
   * memory pool. Cannot be used in combination with `networkFeeOverride`
   */
  prioritisationFee?: number;
  blocksTillExpiry?: number;
  account?: wallet.Account;

  networkFeeOverride?: u.BigInteger;
  systemFeeOverride?: u.BigInteger;
}
