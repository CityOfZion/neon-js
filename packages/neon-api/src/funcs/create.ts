import { tx } from "@cityofzion/neon-core";
import { ManagedApiBasicConfig } from "./types";

export async function createTx(
  config: ManagedApiBasicConfig
): Promise<ManagedApiBasicConfig> {
  config.tx = new tx.Transaction(
    Object.assign(
      {
        intents: config.intents || []
      },
      config.override
    )
  );
  return config;
}
