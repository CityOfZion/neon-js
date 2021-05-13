/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { logging, rpc, tx } from "@cityofzion/neon-core";
import { checkProperty } from "./common";
import {
  DoInvokeConfig,
  ManagedApiBasicConfig,
  SendAssetConfig,
} from "./types";

const log = logging.default("api");
/**
 * Sends a transaction off within the config object.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object + response
 */
export async function sendTx<
  T extends ManagedApiBasicConfig<tx.BaseTransaction>
>(config: T): Promise<T> {
  checkProperty(config, "tx", "url");
  const response = await rpc.Query.sendRawTransaction(config.tx!).execute(
    config.url!
  );
  if (response.result === true) {
    response.txid = config.tx!.hash;
  } else {
    log.error(
      `Transaction failed for ${
        config.account.address
      }: ${config.tx!.serialize()}`
    );
  }
  return Object.assign(config, { response });
}

export async function applyTxToBalance<
  T extends DoInvokeConfig | SendAssetConfig
>(config: T): Promise<T> {
  if (config.response && config.response.result && config.balance) {
    config.balance.applyTx(config.tx!, false);
  }
  return config;
}
