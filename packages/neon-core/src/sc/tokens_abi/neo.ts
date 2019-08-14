import { getScriptHashFromAddress } from "../../wallet";
import ContractParam from "../ContractParam";
import { ScriptResult } from "../ScriptBuilder";
import { NativeNEP5 } from "./native_nep5";

export class NEO extends NativeNEP5 {
  public constructor() {
    super("NEO");
  }

  public buildScript(method: string, args?: any[]): ScriptResult {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    this._sb.reset();
    return this._sb.emitNeoCall(method, args).exportAsScriptResult();
  }

  public unclaimedGas(addr: string, end: number): ScriptResult {
    return this.buildScript("unclaimedGas", [
      getScriptHashFromAddress(addr),
      ContractParam.integer(end.toString())
    ]);
  }

  public registerValidator(pubkey: string): ScriptResult {
    return this.buildScript("registerValidator", [
      ContractParam.publicKey(pubkey)
    ]);
  }

  public getRegisteredValidators(): ScriptResult {
    return this.buildScript("getRegisteredValidators");
  }

  public getValidators(): ScriptResult {
    return this.buildScript("getValidators");
  }

  public getNextBlockValidators(): ScriptResult {
    return this.buildScript("getNextBlockValidators");
  }

  public vote(addr: string, pubkeys: string[]): ScriptResult {
    return this.buildScript("vote", [
      getScriptHashFromAddress(addr),
      ContractParam.array(
        ...pubkeys.map(pubkey => ContractParam.publicKey(pubkey))
      )
    ]);
  }
}
