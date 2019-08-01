import { ScriptResult } from "../ScriptBuilder";
import { Fixed8 } from "../../u";

export abstract class NativeContract {
  public constructor(name = "Native") {
    console.log(`Initiating ${name} contract`);
  }

  abstract buildScript(method: string, args?: any[]): ScriptResult;

  public supportedStandards(): ScriptResult {
    return this.buildScript("supportedStandards");
  }
}
