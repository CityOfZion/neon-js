/**
 * ContractParam models after the ContractParameter class in C#. It is useful to craft arguments that are used in invoke and invokefunction RPC calls.
 * ContractParams come with convenient static methods to create arguments. For example, the byteArray method helps convert an address into reversed ScriptHash form used in smart contracts.
 */
export class ContractParam {
  constructor(type: string, value: any)

  /** Creates a String ContractParam. */
  static string(value: string): ContractParam

  /** Creates a Boolean ContractParam. Does basic checks to convert value into a boolean. */
  static boolean(value: any): ContractParam

  /** Creates a Hash160 ContractParam. This is used for containing a scriptHash. Do not reverse the input if using this format. */
  static hash160(value: string): ContractParam

  /** Creates an Integer ContractParam. Does basic parsing and rounding to convert value into an Integer. */
  static integer(value: any): ContractParam

  /** Creates a ByteArray ContractParam. */
  static byteArray(value: any, format: string): ContractParam

  /** Creates an Array ContractParam. */
  static array(param: any[]): ContractParam
}
