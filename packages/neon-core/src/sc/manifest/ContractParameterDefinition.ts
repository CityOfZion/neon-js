import { ContractParamType } from "../ContractParam";

export interface ContractParameterDefinition {
  name: string;
  type: ContractParamType;
}

export interface ContractParameterDefinitionJson {
  name: string;
  type: string;
}
