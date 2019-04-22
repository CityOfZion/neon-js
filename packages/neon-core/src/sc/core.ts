import { str2hexstring } from "../u";
import ScriptBuilder, { ScriptIntent } from "./ScriptBuilder";

/**
 * Translates a ScriptIntent / array of ScriptIntents into hexstring.
 */
export function createScript(...intents: (ScriptIntent | string)[]): string {
  const sb = new ScriptBuilder();
  for (const scriptIntent of intents) {
    if (typeof scriptIntent === "string") {
      sb.str += scriptIntent;
      continue;
    }
    if (!scriptIntent.scriptHash) {
      throw new Error("No scriptHash found!");
    }
    const { scriptHash, operation, args, useTailCall } = Object.assign(
      { operation: null, args: undefined, useTailCall: false },
      scriptIntent
    );

    sb.emitAppCall(scriptHash, operation, args, useTailCall);
  }
  return sb.str;
}

export interface DeployParams {
  script: string;
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
export function generateDeployScript(params: DeployParams): ScriptBuilder {
  const sb = new ScriptBuilder();
  sb.emitPush(str2hexstring(params.description))
    .emitPush(str2hexstring(params.email))
    .emitPush(str2hexstring(params.author))
    .emitPush(str2hexstring(params.version))
    .emitPush(str2hexstring(params.name))
    .emitPush(params.needsStorage || false)
    .emitPush(params.returnType || "ff00")
    .emitPush(params.parameterList)
    .emitPush(params.script)
    .emitSysCall("Neo.Contract.Create");
  return sb;
}
