import { NATIVE_CONTRACT_HASH } from "../../consts";
import { BigInteger } from "../../u";
import { ContractParam } from "../ContractParam";
import { ContractMethodDefinition } from "../manifest";
import { ContractCall } from "../types";
import { Nep17Contract } from "./Nep17Contract";
import neoAbi from "./templates/NeoTemplateAbi.json";

let SINGLETON: NeoContract;

export class NeoContract extends Nep17Contract {
  public static get INSTANCE(): NeoContract {
    if (!SINGLETON) {
      SINGLETON = new NeoContract();
    }
    return SINGLETON;
  }

  /**
   * The list of methods found on the NEO contract.
   */
  public static getMethods(): ContractMethodDefinition[] {
    return neoAbi.methods.map((m) => ContractMethodDefinition.fromJson(m));
  }

  constructor() {
    super(NATIVE_CONTRACT_HASH.NeoToken, NeoContract.getMethods());
  }

  public unclaimedGas(address: string, end: number | BigInteger): ContractCall {
    return this.call(
      "unclaimedGas",
      ContractParam.hash160(address),
      ContractParam.integer(end)
    );
  }
}
