import ContractParam from "../ContractParam";
import { ScriptResult } from "../ScriptBuilder";
import { NativeNEP5 } from "./native_nep5";

export class GAS extends NativeNEP5 {
  public constructor() {
    super("GAS");
  }

  public buildScript(method: string, args?: any[]): ScriptResult {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    this._sb.reset();
    return this._sb.emitGasCall(method, args).exportAsScriptResult();
  }

  public getSysFeeAmount(index: number): ScriptResult {
    return this.buildScript("getSysFeeAmount", [ContractParam.integer(index)]);
  }
}
