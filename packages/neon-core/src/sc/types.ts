import ContractParam, { ContractParamJson } from "./ContractParam";
import { CallFlags } from "./CallFlags";

export interface ContractCall {
  /** Hexstring of 40 characters in BE */
  scriptHash: string;
  /** UTF8 string */
  operation: string;
  callFlags?: CallFlags;
  args?: ContractParam[];
}

export interface ContractCallJson {
  /** Hexstring of 40 characters in BE */
  scriptHash: string;
  /** UTF8 string */
  operation: string;
  callFlags?: CallFlags;
  args?: ContractParamJson[];
}
