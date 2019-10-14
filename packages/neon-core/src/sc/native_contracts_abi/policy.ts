import ScriptBuilder from "../ScriptBuilder";
import ContractParam from "../ContractParam";
import { NativeContract } from "./NativeContract";
import { ASSET_ID } from "../../consts";

/**
 * Policy Token Contract is about consensus configuration.
 */
export class Policy extends NativeContract {
  private _sb: ScriptBuilder;

  public constructor() {
    super("Policy");
    this._sb = new ScriptBuilder();
  }

  public buildScript(method: string, args?: any[]): string {
    if (!this._sb) {
      throw new Error("sb not initiated");
    }
    this._sb.reset();
    this._sb.str = "";
    return this._sb.emitAppCall(ASSET_ID.POLICY, method, args).str;
  }

  public getMaxTransactionsPerBlock(): string {
    return this.buildScript("getMaxTransactionsPerBlock");
  }

  public getFeePerByte(): string {
    return this.buildScript("getFeePerByte");
  }

  public getBlockedAccounts(): string {
    return this.buildScript("getBlockedAccounts");
  }

  public setMaxTransactionsPerBlock(value: number): string {
    return this.buildScript("setMaxTransactionsPerBlock", [
      ContractParam.integer(value)
    ]);
  }

  public setFeePerByte(value: number): string {
    return this.buildScript("setFeePerByte", [ContractParam.integer(value)]);
  }

  public blockAccount(addr: string): string {
    return this.buildScript("blockAccount", [ContractParam.hash160(addr)]);
  }

  public unblockAccount(addr: string): string {
    return this.buildScript("unblockAccount", [ContractParam.hash160(addr)]);
  }
}
