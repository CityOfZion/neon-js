import { ScriptBuilder } from "../ScriptBuilder";
import { Fixed8 } from "../../u";
import ContractParam from "../ContractParam";
import { NativeContract } from "./NativeContract";

/**
 * In neo core project, NEP5Token is a native contract that is extended by NEO and GAS
 */
export class NEP5 extends NativeContract {
  public scriptHash: string;
  protected _sb: ScriptBuilder;
  public constructor(name: string = "NEP5", scriptHash: string = "") {
    super(name);
    this.scriptHash = scriptHash;
    this._sb = new ScriptBuilder();
  }

  public buildScript(method: string, args?: any[]): string {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    if (!this.scriptHash) {
      throw new Error("scriptHash not assigned.");
    }
    this._sb.reset();
    this._sb.str = "";
    return this._sb.emitAppCall(this.scriptHash, method, args).str;
  }

  public name(): string {
    return this.buildScript("name");
  }

  public symbol(): string {
    return this.buildScript("symbol");
  }

  public decimals(): string {
    return this.buildScript("decimals");
  }

  public totalSupply(): string {
    return this.buildScript("totalSupply");
  }

  public balanceOf(addr: string): string {
    return this.buildScript("balanceOf", [ContractParam.hash160(addr)]);
  }

  public transfer(
    fromAddr: string,
    toAddr: string,
    amt: Fixed8 | number
  ): string {
    const fromHash = ContractParam.hash160(fromAddr);
    const toHash = ContractParam.hash160(toAddr);
    const adjustedAmt = new Fixed8(amt).toRawNumber();
    return this.buildScript("transfer", [
      fromHash,
      toHash,
      ContractParam.integer(adjustedAmt.toString())
    ]);
  }
}
