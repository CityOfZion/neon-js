import ScriptBuilder, { ScriptIntent } from "./ScriptBuilder";
import InteropServiceCode from "./InteropServiceCode";
import { ContractManifest } from "./manifest";
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
    const { scriptHash, operation, args = [] } = Object.assign(
      { operation: null, args: undefined },
      scriptIntent
    );

    sb.emitAppCall(scriptHash, operation, args);
  }
  return sb.str;
}

export interface DeployParams {
  script: string;
  manifest: string;
}

export function validateDeployParams(params: DeployParams): void {
  const { script, manifest } = params;
  if (script.length > 1024 * 1024) {
    throw new Error(
      `Script length ${script.length} is exceeding upper limit: 1024*1024`
    );
  }
  if (manifest.length > ContractManifest.MAX_LENGTH) {
    throw new Error(
      `Manifest length ${manifest.length} is exceeding upper limit: ${ContractManifest.MAX_LENGTH}`
    );
  }
  const contractManifest = ContractManifest.parse(manifest);
  if (!contractManifest.isValid()) {
    throw new Error(`Manifest is not valid!`);
  }
}
/**
 * Generates script for deploying contract
 */
export function generateDeployScript(params: DeployParams): ScriptBuilder {
  validateDeployParams(params);
  const sb = new ScriptBuilder();
  sb.emitPush(params.manifest)
    .emitPush(params.script)
    .emitSysCall(InteropServiceCode.SYSTEM_CONTRACT_CREATE);
  return sb;
}

export function generateUpdateScript(params: DeployParams): ScriptBuilder {
  validateDeployParams(params);
  const sb = new ScriptBuilder();
  sb.emitPush(params.manifest)
    .emitPush(params.script)
    .emitSysCall(InteropServiceCode.SYSTEM_CONTRACT_UPDATE);
  return sb;
}
