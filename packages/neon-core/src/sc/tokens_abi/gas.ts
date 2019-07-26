import { NEP5 } from "./nep5";
import ContractParam from "../ContractParam";

export class GAS extends NEP5 {
  public static getInstance(): GAS {
    return new GAS();
  }

  public _buildScript(method: string, args?: any[]): string {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    this._sb.reset();
    return this._sb.emitGasCall(method, args).str;
  }

  public getSysFeeAmount(index: number): string {
    return this._buildScript("getSysFeeAmount", [ContractParam.integer(index)]);
  }
}
