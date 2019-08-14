import { logging, rpc, tx } from "@cityofzion/neon-core";
import { checkProperty } from "./common";
import { ManagedApiBasicConfig } from "./types";

const log = logging.default("api");
/**
 * Sends a transaction off within the config object.
 * @param {object} config - Configuration object.
 * @return {Promise<object>} Configuration object + response
 */
export async function sendTx(
  config: ManagedApiBasicConfig
): Promise<ManagedApiBasicConfig> {
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
