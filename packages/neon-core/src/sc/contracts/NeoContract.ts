import { NATIVE_CONTRACTS } from "../../consts";
import { BigInteger } from "../../u";
import { ContractParam } from "../ContractParam";
import { ContractMethodDefinition } from "../manifest";
import { ContractCall } from "../types";
import { Nep5Contract } from "./Nep5Contract";
import neoAbi from "./templates/NeoTemplateAbi.json";

let SINGLETON: NeoContract;

export class NeoContract extends Nep5Contract {
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
    super(NATIVE_CONTRACTS.NEO, NeoContract.getMethods());
  }

  public unclaimedGas(address: string, end: number | BigInteger): ContractCall {
    return this.call(
      "unclaimedGas",
      ContractParam.hash160(address),
      ContractParam.integer(end)
    );
  }
}
