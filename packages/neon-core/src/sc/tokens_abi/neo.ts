import { NEP5 } from "./nep5";
import { getScriptHashFromAddress } from "../../wallet";
import ContractParam from "../ContractParam";

export class NEO extends NEP5 {
  public static getInstance(): NEO {
    return new NEO();
  }

  public _buildScript(method: string, args?: any[]): string {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    this._sb.reset();
    return this._sb.emitNeoCall(method, args).str;
  }

  public unclaimedGas(addr: string, end: number): string {
    return this._buildScript("unclaimedGas", [
      getScriptHashFromAddress(addr),
      ContractParam.integer(end.toString())
    ]);
  }

  public registerValidator(pubkey: string): string {
    return this._buildScript("registerValidator", [
      ContractParam.publicKey(pubkey)
    ]);
  }

  public getRegisteredValidators(): string {
    return this._buildScript("getRegisteredValidators");
  }

  public getValidators(): string {
    return this._buildScript("getValidators");
  }

  public getNextBlockValidators(): string {
    return this._buildScript("getNextBlockValidators");
  }

  public vote(addr: string, pubkeys: string[]): string {
    return this._buildScript("vote", [
      getScriptHashFromAddress(addr),
      ContractParam.array(
        ...pubkeys.map(pubkey => ContractParam.publicKey(pubkey))
      )
    ]);
  }
}
