export class ContractParam {
  constructor(type: string, value: any)

  static string(value: string): ContractParam
  static boolean(value: any): ContractParam
  static hash160(value: string): ContractParam
  static integer(value: any): ContractParam
  static byteArray(value: any, format: string): ContractParam
  static array(param: any[]): ContractParam
}
