import { NATIVE_CONTRACTS } from "../../consts";
import { ContractMethodDefinition } from "../manifest";
import { Nep5Contract } from "./Nep5Contract";
import gasAbi from "./templates/GasTemplateAbi.json";

let SINGLETON: GasContract;

export class GasContract extends Nep5Contract {
  public static get INSTANCE(): GasContract {
    if (!SINGLETON) {
      SINGLETON = new GasContract();
    }
    return SINGLETON;
  }

  /**
   * The list of methods found on the GAS contract.
   */
  public static getMethods(): ContractMethodDefinition[] {
    return gasAbi.methods.map((m) => ContractMethodDefinition.fromJson(m));
  }

  constructor() {
    super(NATIVE_CONTRACTS.GAS, GasContract.getMethods());
  }
}
