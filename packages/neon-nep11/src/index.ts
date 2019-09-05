import * as _Neon from "@cityofzion/neon-core";
import * as nep11 from "./plugin";

function bundle<T extends typeof _Neon>(
  neonCore: T
): T & { nep11: typeof nep11 } {
  return { ...(neonCore as any), nep11 };
}

export default bundle;
export * from "./plugin";
