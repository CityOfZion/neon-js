import { str2hexstring, Fixed8 } from "../u";
import ScriptBuilder, { ScriptIntent, ScriptResult } from "./ScriptBuilder";
import InteropServiceCode from "./InteropServiceCode";
import { ASSET_ID } from "../consts";

/**
 * Translates a ScriptIntent / array of ScriptIntents into hexstring.
 */
export function createScript(
  ...intents: (ScriptIntent | string)[]
): ScriptResult {
  const sb = new ScriptBuilder();
  for (const scriptIntent of intents) {
    if (typeof scriptIntent === "string") {
      sb.str += scriptIntent;
      continue;
    }
    if (!scriptIntent.scriptHash) {
      throw new Error("No scriptHash found!");
    }
    const { scriptHash, operation, args = [] } = Object.assign(
      { operation: null, args: undefined },
      scriptIntent
    );

    if (scriptHash === ASSET_ID.NEO || scriptHash.toUpperCase() === "NEO") {
      sb.emitNeoCall(operation, args);
    } else if (
      scriptHash === ASSET_ID.GAS ||
      scriptHash.toUpperCase() === "GAS"
    ) {
      sb.emitGasCall(operation, args);
    } else if (
      scriptHash === ASSET_ID.POLICY ||
      scriptHash.toUpperCase() === "POLICY"
    ) {
      sb.emitPolicyCall(operation, args);
    } else {
      sb.emitAppCall(scriptHash, operation, args);
    }
  }
  return sb.exportAsScriptResult();
}

export interface DeployParams {
  script: string;
  manifest: string;
  name: string;
  version: string;
  author: string;
  email: string;
  description: string;
  needsStorage: boolean;
  returnType: string;
  parameterList: string;
}
/**
 * Generates script for deploying contract
 */
// TODO: not sure if this has to be modifed or not
// TODO: need to add a class: Manifest
export function generateDeployScript(params: DeployParams) {
  const sb = new ScriptBuilder();
  sb.emitPush(str2hexstring(params.description))
    .emitPush(str2hexstring(params.email))
    .emitPush(str2hexstring(params.author))
    .emitPush(str2hexstring(params.version))
    .emitPush(str2hexstring(params.name))
    .emitPush(params.needsStorage || false)
    .emitPush(params.returnType || "ff00")
    .emitPush(params.parameterList)
    .emitPush(params.manifest)
    .emitPush(params.script)
    .emitSysCall(
      InteropServiceCode.NEO_CONTRACT_CREATE,
      (params.manifest.length + params.script.length) / 2
    );
  return sb;
}

// TODO: update a deployed contract
export function generateUpdateScript() {
  throw new Error("Not Implemented.");
}

// TODO: destroy a deployed contract
export function generateDestroyScript() {
  throw new Error("Not Implemented.");
}
