import { ContractParamType } from "../ContractParam";
import { ContractParameterDefinition } from ".";

export interface ContractMethodDescriptorLike {
  name: string;
  parameters: ContractParameterDefinition[];
  returnType: ContractParamType;
}

export class ContractMethodDescriptor {
  public name: string;
  public parameters: ContractParameterDefinition[];
  public returnType: ContractParamType;

  public constructor(obj: Partial<ContractMethodDescriptorLike>) {
    const {
      name = "",
      parameters = [],
      returnType = ContractParamType.Any
    } = obj;
    this.name = name;
    this.parameters = [...parameters];
    this.returnType = returnType;
  }

  public export(): ContractMethodDescriptorLike {
    return {
      name: this.name,
      parameters: [...this.parameters],
      returnType: this.returnType
    };
  }
}
