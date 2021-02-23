import ContractParam, {
  ContractParamJson,
  ContractParamType,
} from "../ContractParam";
import { ContractMethodDefinition } from "../manifest";
import { ContractCall } from "../types";
import { CallFlags } from "../NEF";

export class BaseContract {
  #scriptHash: string;
  #abi: Record<string, ContractMethodDefinition> = {};

  public get scriptHash(): string {
    return this.#scriptHash;
  }
  /**
   * Getter for retrieving the ABI for this contract.
   * This is made readonly with Typescript. This has no effect in Javascript.
   */
  public get methods(): Readonly<Record<string, ContractMethodDefinition>> {
    return this.#abi;
  }

  constructor(scriptHash: string, methods: ContractMethodDefinition[] = []) {
    this.#scriptHash = scriptHash;
    this.#abi = methods.reduce((map, method) => {
      map[method.name] = method;
      return map;
    }, {} as Record<string, ContractMethodDefinition>);
  }

  public call(
    method: ContractMethodDefinition | string,
    ...inputArgs: (
      | string
      | boolean
      | number
      | ContractParam
      | ContractParamJson
    )[]
  ): ContractCall {
    const methodDefinition =
      typeof method === "string" ? this.#abi[method] : method;

    if (methodDefinition === undefined) {
      throw new Error(`The method ${method} is not defined on this contract.`);
    }

    if (methodDefinition.parameters.length !== inputArgs.length) {
      throw new Error(
        `Invalid number of parameters provided. Method requires ${methodDefinition.parameters.length} parameters but got ${inputArgs.length}.`
      );
    }

    const args = inputArgs.map((arg, index) =>
      convertParameter(arg, methodDefinition.parameters[index].type)
    );

    return {
      scriptHash: this.scriptHash,
      operation: methodDefinition.name,
      callFlags: CallFlags.All,
      args: args,
    };
  }
}

function convertParameter(
  arg: string | boolean | number | ContractParam | ContractParamJson,
  type: ContractParamType
): ContractParam {
  if (typeof arg === "object") {
    const contractParamInstance =
      arg instanceof ContractParam ? arg : ContractParam.fromJson(arg);

    if (isCompatibleType(contractParamInstance.type, type)) {
      return contractParamInstance;
    } else {
      throw new Error(
        `Provided ${contractParamInstance.type} when trying to get ${type}`
      );
    }
  }

  return ContractParam.fromJson({
    type: ContractParamType[type],
    value: arg,
  });
}

function isCompatibleType(
  givenType: ContractParamType,
  requiredType: ContractParamType
): boolean {
  return (
    // same type
    requiredType === givenType ||
    // Hash160 & Hash256 are subsets of ByteArray
    (requiredType === ContractParamType.ByteArray &&
      (givenType === ContractParamType.Hash160 ||
        givenType === ContractParamType.Hash256))
  );
}
