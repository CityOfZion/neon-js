import { ContractParam } from "../ContractParam";
import { ContractMethodDefinition } from "../manifest";
import { ContractCall } from "../types";
import { BaseContract } from "./BaseContract";
import defaultAbi from "./Nep5TemplateMethods.json";

/**
 * A standard NEP-5 contract according to specification.
 */
export class Nep5Contract extends BaseContract {
  /**
   * The list of methods found on the NEP-5 specification.
   */
  public static getMethods(): ContractMethodDefinition[] {
    return defaultAbi.methods.map((m) => ContractMethodDefinition.fromJson(m));
  }

  constructor(
    scriptHash: string,
    additionalMethods: ContractMethodDefinition[] = []
  ) {
    super(scriptHash, Nep5Contract.getMethods().concat(additionalMethods));
  }

  public name(): ContractCall {
    return this.call("name");
  }

  public symbol(): ContractCall {
    return this.call("symbol");
  }

  public decimals(): ContractCall {
    return this.call("decimals");
  }

  /**
   * Retrieves the balance of the address.
   * The balance returned will be an integer which needs to be processed according to the number of decimals for this token.
   *
   * @param address - The address to enquire.
   *
   * @example
   * const contract = new Nep5Contract(contractHash);
   * const balanceOfCall = contract.balanceOf(address);
   * const result = 
   */
  public balanceOf(address: string): ContractCall {
    return this.call("balanceOf", ContractParam.hash160(address));
  }

  public totalSupply(): ContractCall {
    return this.call("totalSupply");
  }

  /**
   * Transfers some token between addresses.
   * The amount of tokens needs to be
   * @param from - The address from where the funds originate.
   * @param to - The address where the funds will arrive at.
   * @param amount - The amount of tokens to transfer.
   */
  public transfer(
    from: string,
    to: string,
    amount: string | number
  ): ContractCall {
    return this.call(
      "transfer",
      ContractParam.hash160(from),
      ContractParam.hash160(to),
      ContractParam.integer(amount)
    );
  }
}
