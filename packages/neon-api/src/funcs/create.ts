/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { sc, tx, u, wallet } from "@cityofzion/neon-core";
import { checkProperty } from "./common";
import {
  ClaimGasConfig,
  DoInvokeConfig,
  SendAssetConfig,
  SetupVoteConfig,
} from "./types";

export async function createClaimTx(
  config: ClaimGasConfig
): Promise<ClaimGasConfig> {
  checkProperty(config, "claims");
  config.tx = new tx.ClaimTransaction(config.override);
  config.tx.addClaims(config.claims!);
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
        outputs: config.intents || [],
        script: processedScript,
        gas: config.gas || 0,
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

export async function createStateTx(
  config: SetupVoteConfig
): Promise<SetupVoteConfig> {
  const descriptors = [
    new tx.StateDescriptor({
      type: tx.StateType.Account,
      key: u.reverseHex(config.account.scriptHash),
      field: "Votes",
      value:
        u.int2hex(config.candidateKeys.length) + config.candidateKeys.join(""),
    }),
  ];
  config.tx = new tx.StateTransaction({ descriptors });
  return config;
}
