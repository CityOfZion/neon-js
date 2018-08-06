import * as nep5 from "./plugin";

export default function(neonCore: typeof import("@cityofzion/neon-core")) {
  return { ...neonCore, nep5 };
}
