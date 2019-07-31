import { NEP5 } from "./nep5";
import ContractParam from "../ContractParam";
import { ScriptResult } from "../ScriptBuilder";
import { Fixed8 } from "../../u";

export class GAS extends NEP5 {
  public constructor() {
    super("GAS");
  }

  public buildScript(method: string, args?: any[]): ScriptResult {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    this._sb.reset();

    const fee = this.methodPrices.get(method);
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

  protected _setMethodPrices() {
    super._setMethodPrices();
    this.methodPrices.set("getSysFeeAmount", new Fixed8(1000000e-8));
  }
}

export const GasInstance = new GAS();
