import { tx } from "@cityofzion/neon-core";
import { ManagedApiBasicConfig } from "./types";

export async function createTx(
  config: ManagedApiBasicConfig
): Promise<ManagedApiBasicConfig> {
  config.tx = new tx.Transaction(
    Object.assign(
      {
        script: config.script
      },
      config.override
    )
  );
  return config;
}
