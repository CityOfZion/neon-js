import { ContractMethodDefinition } from "../manifest/ContractMethodDefinition";
import { ContractCall } from "../types";
import { BaseContract } from "./BaseContract";
import policyAbi from "./templates/PolicyTemplateAbi.json";
import { NATIVE_CONTRACTS } from "../../consts";

let SINGLETON: PolicyContract;
/**
 * Policy Contract that contains block-specific parameters for the current blockchain.
 * Helper methods are not fully implemented but the complete definition is available.
 */
export class PolicyContract extends BaseContract {
  public static get INSTANCE(): PolicyContract {
    if (!SINGLETON) {
      SINGLETON = new PolicyContract();
    }
    return SINGLETON;
  }

  public static getMethods(): ContractMethodDefinition[] {
    return policyAbi.methods.map((m) => ContractMethodDefinition.fromJson(m));
  }

  constructor() {
    super(NATIVE_CONTRACTS.POLICY, PolicyContract.getMethods());
  }

  public name(): ContractCall {
    return this.call("name");
  }

  public getFeePerByte(): ContractCall {
    return this.call("getFeePerByte");
  }
}
