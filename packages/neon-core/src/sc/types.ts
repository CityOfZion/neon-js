import ContractParam from "./ContractParam";

export interface ContractCall {
  /** Hexstring of 40 characters in BE */
  scriptHash: string;
  /** ASCII string */
  operation: string;
  args?: ContractParam[];
}
