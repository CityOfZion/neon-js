import * as _Neon from "@cityofzion/neon-core";
import * as nns from "./plugin";

function bundle<T extends typeof _Neon>(neonCore: T): T & { nns: typeof nns } {
  return { ...(neonCore as any), nns };
}

export default bundle;
export * from "./plugin";
