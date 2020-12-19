import { ScriptBuilder } from "./ScriptBuilder";
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
