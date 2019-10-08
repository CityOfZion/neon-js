import { ContractParameterDefinition } from "./ContractParameterDefinition";

export interface ContractEventDescriptorLike {
  name: string;
  parameters: ContractParameterDefinition[];
}

export class ContractEventDescriptor {
  public name: string;
  public parameters: ContractParameterDefinition[];

  public constructor(obj: Partial<ContractEventDescriptorLike>) {
    const { name = "", parameters = [] } = obj;
    this.name = name;
    this.parameters = [...parameters];
  }

  public export() {
    return {
      name: this.name,
      parameters: [...this.parameters]
    };
  }
}
