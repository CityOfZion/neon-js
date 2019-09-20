import * as _Neon from "@cityofzion/neon-core";
import { default as apiSettings } from "./settings";
import { TransactionBuilder } from "./transationBuilder";
import { NetProvider, EntityProvider } from "./providers";

function assignSettings(
  baseSettings: typeof _Neon.settings,
  newSettings: { [k: string]: any }
): void {
  for (var key in newSettings) {
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
  NetProvider: NetProvider;
  EntityProvider: EntityProvider;
} {
  assignSettings(neonCore.settings, apiSettings);
  return {
    ...(neonCore as any),
    TransactionBuilder,
    NetProvider,
    EntityProvider
  };
}

export default bundle;
