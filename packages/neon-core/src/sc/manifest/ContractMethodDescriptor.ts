import { ContractParamType } from "../ContractParam";
import {
  ContractParameterDefinitionLike,
  ContractParameterDefinition
} from ".";

export interface ContractMethodDescriptorLike {
  name: string;
  parameters: ContractParameterDefinitionLike[];
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
    this.parameters = parameters.map(
      param => new ContractParameterDefinition(param)
    );
    this.returnType = returnType;
  }

  public export(): ContractMethodDescriptorLike {
    return {
      name: this.name,
      parameters: this.parameters.map(parameter => parameter.export()),
      returnType: this.returnType
    };
  }
}
