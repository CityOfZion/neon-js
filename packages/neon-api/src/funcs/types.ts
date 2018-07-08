import { tx, u, wallet } from "@cityofzion/neon-core";
import { Provider } from "../provider/common";

export interface ManagedApiBasicConfig<T extends tx.BaseTransaction>{
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
  tx?: T;
  response?: {
    result: boolean;
    txid?: string;
  };
  sendingFromSmartContract?: string;
}

export interface SendAssetConfig extends ManagedApiBasicConfig<tx.ContractTransaction> {
  balance: wallet.Balance;
  intents: tx.TransactionOutput[];
}

export interface ClaimGasConfig extends ManagedApiBasicConfig<tx.ClaimTransaction> {
  claims: wallet.Claims;
}

export interface DoInvokeConfig extends ManagedApiBasicConfig<tx.InvocationTransaction> {
  balance?: wallet.Balance;
  intents: tx.TransactionOutput[];
  gas?: number | u.Fixed8;
  script: any;
}
