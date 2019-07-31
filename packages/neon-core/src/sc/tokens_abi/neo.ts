import { NEP5 } from "./nep5";
import { getScriptHashFromAddress } from "../../wallet";
import ContractParam from "../ContractParam";
import { ScriptResult } from "../ScriptBuilder";
import { Fixed8 } from "../../u";

export class NEO extends NEP5 {
  public constructor() {
    super("NEO");
  }

  public buildScript(method: string, args?: any[]): ScriptResult {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    this._sb.reset();
    const fee = this.methodPrices.get(method);
    if (fee === undefined) {
      throw new Error(`${method} price not stored!`);
    }
    return {
      hex: this._sb.emitNeoCall(method, args).str,
      fee
    };
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

  protected _setMethodPrices() {
    super._setMethodPrices();
    this.methodPrices.set("unclaimedGas", new Fixed8(3000000e-8));
    this.methodPrices.set("registerValidator", new Fixed8(5000000e-8));
    this.methodPrices.set("getRegisteredValidators", new Fixed8(1));
    this.methodPrices.set("getValidators", new Fixed8(1));
    this.methodPrices.set("getNextBlockValidators", new Fixed8(1));
    this.methodPrices.set("vote", new Fixed8(5));
  }
}

export const NeoInstance = new NEO();
