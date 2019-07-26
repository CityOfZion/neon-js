import { ScriptBuilder } from "../ScriptBuilder";
import { getScriptHashFromAddress } from "../../wallet";
import { Fixed8 } from "../../u";
import ContractParam from "../ContractParam";

export class NEP5 {
  public scriptHash: string;
  protected _sb: ScriptBuilder;
  public constructor(scriptHash: string = "") {
    this.scriptHash = scriptHash;
    this._sb = new ScriptBuilder();
  }

  public _buildScript(method: string, args?: any[]): string {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    if (!this.scriptHash) {
      throw new Error("scriptHash not assigned.");
    }
    this._sb.reset();
    return this._sb.emitAppCall(this.scriptHash, method, args).str;
  }

  public name(): string {
    return this._buildScript("name");
  }

  public symbol(): string {
    return this._buildScript("symbol");
  }

  public decimals(): string {
    return this._buildScript("decimals");
  }

  public totalSupply(): string {
    return this._buildScript("totalSupply");
  }

  public balanceOf(addr: string): string {
    return this._buildScript("balanceOf", [getScriptHashFromAddress(addr)]);
  }

  public transfer(
    fromAddr: string,
    toAddr: string,
    amt: Fixed8 | number
  ): string {
    const fromHash = getScriptHashFromAddress(fromAddr);
    const toHash = getScriptHashFromAddress(toAddr);
    const adjustedAmt = new Fixed8(amt).mul(100000000);
    return this._buildScript("transfer", [
      fromHash,
      toHash,
      ContractParam.integer(adjustedAmt.toString())
    ]);
  }
}
