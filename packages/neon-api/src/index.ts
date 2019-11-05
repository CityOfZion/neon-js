import * as _Neon from "@cityofzion/neon-core";
import { default as apiSettings } from "./settings";
import { TransactionBuilder } from "./txService";

function assignSettings(
  baseSettings: typeof _Neon.settings,
  newSettings: { [k: string]: any }
): void {
  for (const key in newSettings) {
    if (!(key in baseSettings)) {
      Object.defineProperty(baseSettings, key, {
        get() {
          return newSettings[key];
        },
        set(val) {
          newSettings[key] = val;
        }
      });
    }
  }
}
function bundle<T extends typeof _Neon>(
  neonCore: T
): T & {
  TransactionBuilder: TransactionBuilder;
} {
  assignSettings(neonCore.settings, apiSettings);
  return {
    ...(neonCore as any),
    TransactionBuilder
  };
}

export default bundle;
