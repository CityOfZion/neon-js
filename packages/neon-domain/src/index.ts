import * as _Neon from "@cityofzion/neon-core";
import * as plugin from "./plugin";

function bundle<T extends typeof _Neon>(
  neonCore: T
): T & { domain: typeof plugin } {
  return { ...(neonCore as any), domain: plugin };
}

export default bundle;
export * from "./plugin";
