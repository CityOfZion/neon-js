import { tx, wallet } from "@cityofzion/neon-core";
import { Provider } from "../provider/common";
import { ScriptIntent } from "@cityofzion/neon-core/lib/sc";

export interface ManagedApiBasicConfig {
  api: Provider;
  url?: string;
  account: wallet.Account;
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
  script: string;
  intents: ScriptIntent[];
}
