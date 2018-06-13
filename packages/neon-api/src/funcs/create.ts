import { tx, wallet } from "@cityofzion/neon-core";
import { checkProperty } from "./common";
import {
  ClaimGasConfig,
  DoInvokeConfig,
  ManagedApiBasicConfig,
  SendAssetConfig
} from "./types";

export async function createClaimTx(
  config: ClaimGasConfig
): Promise<ClaimGasConfig> {
  checkProperty(config, "claims");
  config.tx = tx.Transaction.createClaimTx(
    config.account!.address,
    config.claims,
    config.override!
  );
  return config as ClaimGasConfig;
}

export async function createContractTx(
  config: SendAssetConfig
): Promise<SendAssetConfig> {
  checkProperty(config, "balance", "intents");
  config.tx = tx.Transaction.createContractTx(
    config.balance!,
    config.intents,
    config.override!,
    config.fees!
  );
  return config;
}

export async function createInvocationTx(
  config: DoInvokeConfig
): Promise<DoInvokeConfig> {
  checkProperty(config, "script");
  config.tx = tx.Transaction.createInvocationTx(
    config.balance || new wallet.Balance(),
    config.intents,
    config.script,
    config.gas || 0,
    config.override!,
    config.fees!
  );
  return config;
}
