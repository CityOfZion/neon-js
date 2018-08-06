import * as plugin from "./plugin";
import { default as apiSettings } from "./settings";



export default function(neonCore: typeof import("@cityofzion/neon-core")) {
  neonCore.settings = Object.assign(neonCore.settings, apiSettings);
  return { ...neonCore, api: plugin };
}
