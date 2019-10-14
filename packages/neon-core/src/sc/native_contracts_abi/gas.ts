import ContractParam from "../ContractParam";
import { NEP5 } from "./nep5";
import { ASSET_ID } from "../../consts";

export class GAS extends NEP5 {
  public constructor() {
    super("GAS");
  }

  public buildScript(method: string, args?: any[]): string {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    this._sb.reset();
    this._sb.str = "";
    return this._sb.emitAppCall(ASSET_ID.GAS, method, args).str;
  }

  public getSysFeeAmount(index: number): string {
    return this.buildScript("getSysFeeAmount", [ContractParam.integer(index)]);
  }
}
