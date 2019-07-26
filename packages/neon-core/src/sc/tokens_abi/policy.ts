import ScriptBuilder from "../ScriptBuilder";
import ContractParam from "../ContractParam";
import { getScriptHashFromAddress } from "../../wallet";

/**
 * Policy Token Contract is about consensus configuration.
 */
export class Policy {
  private _sb: ScriptBuilder;

  public constructor() {
    this._sb = new ScriptBuilder();
  }

  public static getInstance() {
    return new Policy();
  }

  public buildScript(method: string, args?: any[]): string {
    if (!this._sb) {
      throw new Error("sb not initiated");
    }

    return this._sb.emitPolicyCall(method, args).str;
  }

  public getMaxTransactionPerBlock() {
    return this.buildScript("getMaxTransactionPerBlock");
  }

  public getFeePerByte() {
    return this.buildScript("getFeePerByte");
  }

  public getBlockedAccounts() {
    return this.buildScript("getBlockedAccounts");
  }

  public setMaxTransactionsPerBlock(value: number) {
    return this.buildScript("setMaxTransactionsPerBlock", [
      ContractParam.integer(value)
    ]);
  }

  public setFeePerByte(value: number) {
    return this.buildScript("setFeePerByte", [ContractParam.integer(value)]);
  }

  public blockAccount(addr: string) {
    return this.buildScript("blockAccount", [getScriptHashFromAddress(addr)]);
  }

  public unblockAccount(addr: string) {
    return this.buildScript("unblockAccount", [getScriptHashFromAddress(addr)]);
  }
}
