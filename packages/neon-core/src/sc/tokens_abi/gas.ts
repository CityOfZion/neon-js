import ContractParam from "../ContractParam";
import { ScriptResult } from "../ScriptBuilder";
import NativeContractMethodPrices from "../NativeContractMethodPrices";
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

    const fee = NativeContractMethodPrices.get(method);
    if (fee === undefined) {
      throw new Error(`${method} price not stored!`);
    }
    return {
      hex: this._sb.emitGasCall(method, args).str,
      fee
    };
  }

  public getSysFeeAmount(index: number): ScriptResult {
    return this.buildScript("getSysFeeAmount", [ContractParam.integer(index)]);
  }
}
