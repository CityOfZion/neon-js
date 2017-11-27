/// <reference path="./api/index.d.ts" />
/// <reference path="./sc/index.d.ts" />
/// <reference path="./rpc/index.d.ts" />
/// <reference path="./wallet/index.d.ts" />
/// <reference path="./transactions/index.d.ts" />
/// <reference path="./utils.d.ts" />
/// <reference path="./consts.d.ts" />
import { u, wallet } from "@cityofzion/neon-js";

declare module '@cityofzion/neon-js' {
  const _semantic: semantic
  export default _semantic
}
