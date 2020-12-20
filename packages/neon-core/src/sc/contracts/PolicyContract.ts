import { ContractMethodDefinition } from "../manifest/ContractMethodDefinition";
import { ContractCall } from "../types";
import { BaseContract } from "./BaseContract";
import policyAbi from "./templates/PolicyTemplateAbi.json";
import { NATIVE_CONTRACT_HASH } from "../../consts";

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
    super(NATIVE_CONTRACT_HASH.PolicyContract, PolicyContract.getMethods());
  }

  public getFeePerByte(): ContractCall {
    return this.call("getFeePerByte");
  }

  public getExecFeeFactor(): ContractCall {
    return this.call("getExecFeeFactor");
  }
}
