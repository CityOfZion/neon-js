import * as _Neon from "@cityofzion/neon-core";
import * as ledger from "./plugin";

function bundle<T extends typeof _Neon>(
  neonCore: T
): T & { ledger: typeof ledger } {
  return { ...(neonCore as any), ledger };
}

export default bundle;
export * from "./plugin";
