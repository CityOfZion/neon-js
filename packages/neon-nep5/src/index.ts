import * as _Neon from "@cityofzion/neon-core";
import * as nep5 from "./plugin";

function bundle<T extends typeof _Neon>(
  neonCore: T
): T & { nep5: typeof nep5 } {
  return { ...(neonCore as any), nep5 };
}

export default bundle;
export * from "./plugin";
