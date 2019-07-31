import ScriptBuilder, { ScriptResult } from "../ScriptBuilder";
import ContractParam from "../ContractParam";
import { getScriptHashFromAddress } from "../../wallet";
import { NativeContract } from "./NativeContract";
import { Fixed8 } from "../../u";

/**
 * Policy Token Contract is about consensus configuration.
 */
export class Policy extends NativeContract {
  private _sb: ScriptBuilder;

  public constructor() {
    super("Policy");
    this._setMethodPrices();
    this._sb = new ScriptBuilder();
  }

  public buildScript(method: string, args?: any[]): ScriptResult {
    if (!this._sb) {
      throw new Error("sb not initiated");
    }
    const fee = this.methodPrices.get(method);
    if (fee === undefined) {
      throw new Error(`${method} price not stored!`);
    }
    return {
      hex: this._sb.emitPolicyCall(method, args).str,
      fee
    };
  }

  public getMaxTransactionPerBlock(): ScriptResult {
    return this.buildScript("getMaxTransactionPerBlock");
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

  protected _setMethodPrices() {
    this.methodPrices.set("getMaxTransactionsPerBlock", new Fixed8(1000000e-8));
    this.methodPrices.set("getFeePerByte", new Fixed8(1000000e-8));
    this.methodPrices.set("getBlockedAccounts", new Fixed8(1000000e-8));
    this.methodPrices.set("setMaxTransactionsPerBlock", new Fixed8(3000000e-8));
    this.methodPrices.set("setFeePerByte", new Fixed8(3000000e-8));
    this.methodPrices.set("blockAccount", new Fixed8(3000000e-8));
    this.methodPrices.set("unblockAccount", new Fixed8(3000000e-8));
  }
}

export const PolicyInstance = new Policy();
