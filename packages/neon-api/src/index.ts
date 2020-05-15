import * as _Neon from "@cityofzion/neon-core";
import * as api from "./plugin";

function bundle<T extends typeof _Neon>(neonCore: T): T & { api: typeof api } {
  return {
    ...neonCore,
    api,
  };
}

export default bundle;
