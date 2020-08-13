import { ContractParamType } from "../ContractParam";
import {
  ContractParameterDefinition,
  ContractParameterDefinitionJson,
} from "./ContractParameterDefinition";
import { parseEnum } from "../../internal";

export interface ContractMethodDefinitionLike {
  name: string;
  offset: number;
  parameters: ContractParameterDefinition[];
  returnType: ContractParamType;
}

export interface ContractMethodDefinitionJson {
  name: string;
  offset: number;
  parameters: ContractParameterDefinitionJson[];
  returntype: string;
}

export class ContractMethodDefinition {
  public name: string;
  public offset: number;
  public parameters: ContractParameterDefinition[];
  public returnType: ContractParamType;

  public static fromJson(
    json: ContractMethodDefinitionJson
  ): ContractMethodDefinition {
    return new ContractMethodDefinition({
      name: json.name,
      offset: json.offset,
      parameters: json.parameters.map((p) => ({
        name: p.name,
        type: parseEnum(p.type, ContractParamType),
      })),
      returnType: parseEnum(json.returntype, ContractParamType),
    });
  }

  public constructor(obj: Partial<ContractMethodDefinitionLike>) {
    const {
      name = "",
      offset = 0,
      parameters = [],
      returnType = ContractParamType.Any,
    } = obj;
    this.name = name;
    this.offset = offset;
    this.parameters = [...parameters];
    this.returnType = returnType;
  }

  public toJson(): ContractMethodDefinitionJson {
    return {
      name: this.name,
      offset: this.offset,
      parameters: this.parameters.map((p) => ({
        name: p.name,
        type: ContractParamType[p.type],
      })),
      returntype: ContractParamType[this.returnType],
    };
  }

  public export(): ContractMethodDefinitionLike {
    return {
      name: this.name,
      offset: this.offset,
      parameters: [...this.parameters],
      returnType: this.returnType,
    };
  }
}
