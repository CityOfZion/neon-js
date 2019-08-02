import { ScriptResult } from "../ScriptBuilder";

export abstract class NativeContract {
  public constructor(name = "Native") {
    console.log(`Initiating ${name} contract`);
  }

  abstract buildScript(method: string, args?: any[]): any;

  public supportedStandards(): ScriptResult {
    return this.buildScript("supportedStandards");
  }
}
