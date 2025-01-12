import {
  ContractParameterDefinition,
  ContractParameterDefinitionJson,
} from "./ContractParameterDefinition";
import { parseEnum } from "../../internal";
import { ContractParamType } from "../ContractParam";

export interface ContractEventDefinitonLike {
  name: string;
  parameters: ContractParameterDefinition[];
}

export interface ContractEventDefinitionJson {
  name: string;
  parameters: ContractParameterDefinitionJson[];
}

export class ContractEventDefiniton {
  public name: string;
  public parameters: ContractParameterDefinition[];

  public static fromJson(
    json: ContractEventDefinitionJson,
  ): ContractEventDefiniton {
    return new ContractEventDefiniton({
      name: json.name,
      parameters: json.parameters.map((p) => ({
        name: p.name,
        type: parseEnum(p.type, ContractParamType),
      })),
    });
  }
  public constructor(obj: Partial<ContractEventDefinitonLike>) {
    const { name = "", parameters = [] } = obj;
    this.name = name;
    this.parameters = [...parameters];
  }

  public toJson(): ContractEventDefinitionJson {
    return {
      name: this.name,
      parameters: this.parameters.map((p) => ({
        name: p.name,
        type: ContractParamType[p.type],
      })),
    };
  }

  public export(): ContractEventDefinitonLike {
    return {
      name: this.name,
      parameters: [...this.parameters],
    };
  }
}
