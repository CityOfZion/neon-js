import { sc, tx, wallet } from "@cityofzion/neon-core";
import { checkProperty } from "./common";
import { ClaimGasConfig, DoInvokeConfig, SendAssetConfig } from "./types";

export async function createClaimTx(
  config: ClaimGasConfig
): Promise<ClaimGasConfig> {
  checkProperty(config, "claims");
  config.tx = new tx.ClaimTransaction(config.override);
  config.tx.addClaims(config.claims);
  return config as ClaimGasConfig;
}

export async function createContractTx(
  config: SendAssetConfig
): Promise<SendAssetConfig> {
  checkProperty(config, "balance", "intents");
  config.tx = new tx.ContractTransaction(
    Object.assign({ outputs: config.intents }, config.override)
  );
  config.tx.calculate(config.balance!, undefined, config.fees!);
  return config;
}

export async function createInvocationTx(
  config: DoInvokeConfig
): Promise<DoInvokeConfig> {
  checkProperty(config, "script");
  const processedScript =
    typeof config.script === "object"
      ? sc.createScript(config.script)
      : config.script;
  config.tx = new tx.InvocationTransaction(
    Object.assign(
      {
        intents: config.intents || [],
        script: processedScript,
        gas: config.gas || 0
      },
      config.override
    )
  );
  config.tx.calculate(
    config.balance || new wallet.Balance(),
    undefined,
    config.fees
  );
  return config;
}
