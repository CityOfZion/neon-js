import { ScriptBuilder } from "./ScriptBuilder";
import { InteropServiceCode } from "./InteropServiceCode";
import { ContractManifest } from "./manifest";
import { ContractCall, ContractCallJson } from "./types";
/**
 * Translates a ScriptIntent / array of ScriptIntents into hexstring.
 * @param scripts - ContractCall or hexstrings.
 */
export function createScript(
  ...scripts: (ContractCall | ContractCallJson | string)[]
): string {
  const sb = new ScriptBuilder();
  for (const script of scripts) {
    if (typeof script === "string") {
      sb.str += script;
      continue;
    }

    const contractCall = script;
    if (!contractCall.scriptHash) {
      throw new Error("No scriptHash found!");
    }
    if (!contractCall.operation) {
      throw new Error("No operation found!");
    }

    sb.emitContractCall(script);
  }
  return sb.build();
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
  ContractManifest.fromJson(JSON.parse(manifest));
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
