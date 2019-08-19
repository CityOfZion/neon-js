import ScriptBuilder, { ScriptResult } from "../ScriptBuilder";
import ContractParam from "../ContractParam";
import { NativeContract } from "./NativeContract";

/**
 * Policy Token Contract is about consensus configuration.
 */
export class Policy extends NativeContract {
  private _sb: ScriptBuilder;

  public constructor() {
    super("Policy");
    this._sb = new ScriptBuilder();
  }

  public buildScript(method: string, args?: any[]): ScriptResult {
    if (!this._sb) {
      throw new Error("sb not initiated");
    }
    return this._sb.emitPolicyCall(method, args).exportAsScriptResult();
  }

  public getMaxTransactionsPerBlock(): ScriptResult {
    return this.buildScript("getMaxTransactionsPerBlock");
  }

  public getFeePerByte(): ScriptResult {
    return this.buildScript("getFeePerByte");
  }

  public getBlockedAccounts(): ScriptResult {
    return this.buildScript("getBlockedAccounts");
  }

  public setMaxTransactionsPerBlock(value: number): ScriptResult {
    return this.buildScript("setMaxTransactionsPerBlock", [
      ContractParam.integer(value)
    ]);
  }

  public setFeePerByte(value: number): ScriptResult {
    return this.buildScript("setFeePerByte", [ContractParam.integer(value)]);
  }

  public blockAccount(addr: string): ScriptResult {
    return this.buildScript("blockAccount", [ContractParam.hash160(addr)]);
  }

  public unblockAccount(addr: string): ScriptResult {
    return this.buildScript("unblockAccount", [ContractParam.hash160(addr)]);
  }
}
