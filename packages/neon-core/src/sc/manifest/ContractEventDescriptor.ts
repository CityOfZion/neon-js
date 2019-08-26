import {
  ContractParameterDefinition,
  ContractParameterDefinitionLike
} from "./ContractParameterDefinition";

export interface ContractEventDescriptorLike {
  name: string;
  parameters: ContractParameterDefinitionLike[];
}

export class ContractEventDescriptor {
  public name: string;
  public parameters: ContractParameterDefinition[];

  public constructor(obj: Partial<ContractEventDescriptorLike>) {
    const { name = "", parameters = [] } = obj;
    this.name = name;
    this.parameters = parameters.map(
      param => new ContractParameterDefinition(param)
    );
  }

  public export() {
    return {
      name: this.name,
      parameters: this.parameters.map(param => param.export())
    };
  }
}
