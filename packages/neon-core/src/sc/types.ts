import ContractParam, { ContractParamJson } from "./ContractParam";

export interface ContractCall {
  /** Hexstring of 40 characters in BE */
  scriptHash: string;
  /** UTF8 string */
  operation: string;
  args?: ContractParam[];
}

export interface ContractCallJson {
  /** Hexstring of 40 characters in BE */
  scriptHash: string;
  /** UTF8 string */
  operation: string;
  args?: ContractParamJson[];
}
