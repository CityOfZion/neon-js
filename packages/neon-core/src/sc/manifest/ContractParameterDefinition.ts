import { ContractParamType } from "../ContractParam";

export interface ContractParameterDefinitionLike {
  name: string;
  type: ContractParamType;
}

export class ContractParameterDefinition {
  public name: string;
  public type: ContractParamType;

  public constructor(obj: Partial<ContractParameterDefinitionLike>) {
    const { name = "", type = ContractParamType.Any } = obj;
    this.name = name;
    this.type = type;
  }

  public export() {
    return {
      name: this.name,
      type: this.type
    };
  }
}
