import * as _Neon from "@cityofzion/neon-core";
import * as plugin from "./plugin";
import { default as apiSettings } from "./settings";

function bundle<T extends typeof _Neon>(
  neonCore: T
): T & { api: typeof plugin } {
  neonCore.settings = Object.assign(neonCore.settings, apiSettings);
  return { ...(neonCore as any), api: plugin };
}

export default bundle;
export * from "./plugin";
