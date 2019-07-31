import { ScriptBuilder, ScriptResult } from "../ScriptBuilder";
import { getScriptHashFromAddress } from "../../wallet";
import { Fixed8 } from "../../u";
import ContractParam from "../ContractParam";
import { NativeContract } from "./NativeContract";

/**
 * In neo core project, NEP5Token is a native contract that is extended by NEO and GAS
 * Here we let it act as both native base class and nep5 contract abi.
 */
export class NEP5 extends NativeContract {
  public scriptHash: string;
  protected _sb: ScriptBuilder;
  public constructor(name: string = "NEP5", scriptHash: string = "") {
    super(name);
    this._setMethodPrices();
    this.scriptHash = scriptHash;
    this._sb = new ScriptBuilder();
  }

  public buildScript(method: string, args?: any[]): ScriptResult {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    if (!this.scriptHash) {
      throw new Error("scriptHash not assigned.");
    }
    this._sb.reset();
    return this._sb
      .emitAppCall(this.scriptHash, method, args)
      .exportAsScriptResult();
  }

  public name(): ScriptResult {
    return this.buildScript("name");
  }

  public symbol(): ScriptResult {
    return this.buildScript("symbol");
  }

  public decimals(): ScriptResult {
    return this.buildScript("decimals");
  }

  public totalSupply(): ScriptResult {
    return this.buildScript("totalSupply");
  }

  public balanceOf(addr: string): ScriptResult {
    return this.buildScript("balanceOf", [getScriptHashFromAddress(addr)]);
  }

  public transfer(
    fromAddr: string,
    toAddr: string,
    amt: Fixed8 | number
  ): ScriptResult {
    const fromHash = getScriptHashFromAddress(fromAddr);
    const toHash = getScriptHashFromAddress(toAddr);
    const adjustedAmt = new Fixed8(amt).mul(100000000);
    return this.buildScript("transfer", [
      fromHash,
      toHash,
      ContractParam.integer(adjustedAmt.toString())
    ]);
  }

  protected _setMethodPrices() {
    this.methodPrices.set("name", new Fixed8(0));
    this.methodPrices.set("symbol", new Fixed8(0));
    this.methodPrices.set("decimals", new Fixed8(0));
    this.methodPrices.set("totalSupply", new Fixed8(1000000e-8));
    this.methodPrices.set("balanceOf", new Fixed8(1000000e-8));
    this.methodPrices.set("transfer", new Fixed8(8000000e-8));
  }
}
