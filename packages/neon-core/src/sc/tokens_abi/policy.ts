import ScriptBuilder, { ScriptResult } from "../ScriptBuilder";
import ContractParam from "../ContractParam";
import { getScriptHashFromAddress } from "../../wallet";
import { NativeContract } from "./NativeContract";
import NativeContractMethodPrices from "../NativeContractMethodPrices";

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
    const fee = NativeContractMethodPrices.get(method);
    if (fee === undefined) {
      throw new Error(`${method} price not stored!`);
    }
    return {
      hex: this._sb.emitPolicyCall(method, args).str,
      fee
    };
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
    return this.buildScript("blockAccount", [getScriptHashFromAddress(addr)]);
  }

  public unblockAccount(addr: string): ScriptResult {
    return this.buildScript("unblockAccount", [getScriptHashFromAddress(addr)]);
  }
}
