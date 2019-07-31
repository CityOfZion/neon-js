import { ScriptResult } from "../ScriptBuilder";
import { Fixed8 } from "../../u";

export abstract class NativeContract {
  protected methodPrices: Map<string, Fixed8>;

  public constructor(name = "Native") {
    console.log(`Initiating ${name} contract`);
    this.methodPrices = new Map();
    this.methodPrices.set("supportedStandards", new Fixed8(0));
  }

  public getMethodPrice(methodName: string): Fixed8 {
    const fee = this.methodPrices.get(methodName);
    return fee ? fee : new Fixed8(0);
  }

  abstract buildScript(method: string, args?: any[]): ScriptResult;

  public supportedStandards(): ScriptResult {
    return this.buildScript("supportedStandards");
  }
}
