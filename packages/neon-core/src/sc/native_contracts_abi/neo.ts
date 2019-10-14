import ContractParam from "../ContractParam";
import { NEP5 } from "./nep5";
import { ASSET_ID } from "../../consts";

export class NEO extends NEP5 {
  public constructor() {
    super("NEO");
  }

  public buildScript(method: string, args?: any[]): string {
    if (!this._sb) {
      throw new Error("sb not initiated.");
    }
    this._sb.reset();
    this._sb.str = "";
    return this._sb.emitAppCall(ASSET_ID.NEO, method, args).str;
  }

  public unclaimedGas(addr: string, end: number): string {
    return this.buildScript("unclaimedGas", [
      ContractParam.hash160(addr),
      ContractParam.integer(end.toString())
    ]);
  }

  public registerValidator(pubkey: string): string {
    return this.buildScript("registerValidator", [
      ContractParam.publicKey(pubkey)
    ]);
  }

  public getRegisteredValidators(): string {
    return this.buildScript("getRegisteredValidators");
  }

  public getValidators(): string {
    return this.buildScript("getValidators");
  }

  public getNextBlockValidators(): string {
    return this.buildScript("getNextBlockValidators");
  }

  public vote(addr: string, pubkeys: string[]): string {
    return this.buildScript("vote", [
      ContractParam.hash160(addr),
      ContractParam.array(
        ...pubkeys.map(pubkey => ContractParam.publicKey(pubkey))
      )
    ]);
  }
}
