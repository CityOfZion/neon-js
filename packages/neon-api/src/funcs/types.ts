import { tx, u, wallet } from "@cityofzion/neon-core";
import { Provider } from "../provider/common";

export interface ManagedApiBasicConfig {
  api: Provider;
  net: string;
  url?: string;
  account?: wallet.Account;
  address?: string;
  publicKey?: string;
  privateKey?: string;
  fees?: number;
  override?: object;
  signingFunction?: (
    tx: string,
    publicKey: string
  ) => Promise<string | string[]>;
  tx?: tx.Transaction;
  response?: {
    result: boolean;
    txid?: string;
  };
  sendingFromSmartContract?: string;
}

export interface SendAssetConfig extends ManagedApiBasicConfig {
  balance: wallet.Balance;
  intents: tx.TransactionOutput[];
}

export interface ClaimGasConfig extends ManagedApiBasicConfig {
  claims: wallet.Claims;
}

export interface DoInvokeConfig extends ManagedApiBasicConfig {
  balance?: wallet.Balance;
  intents: tx.TransactionOutput[];
  gas?: number | u.Fixed8;
  script: any;
}
