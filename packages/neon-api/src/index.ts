import * as _Neon from "@cityofzion/neon-core";
import * as factory from "./transaction";

function bundle<T extends typeof _Neon>(
  neonCore: T
): T & {
  api: typeof factory;
} {
  return {
    ...neonCore,
    api: factory,
  };
}

export default bundle;
