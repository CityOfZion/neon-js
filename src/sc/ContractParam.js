import { num2fixed8, reverseHex } from '../utils'
import { getScriptHashFromAddress, isAddress } from '../wallet'

/**
 * @class ContractParam
 * @classdesc
 * ContractParam models after the ContractParameter class in C#. It is useful to craft arguments that are used in invoke and invokefunction RPC calls.
 * ContractParams come with convenient static methods to create arguments. For example, the byteArray method helps convert an address into reversed ScriptHash form used in smart contracts.
 */
class ContractParam {
  constructor (type, value) {
    /** @type {string} */
    this.type = type
    /** @type {any} */
    this.value = value
  }

  /**
   * Creates a String ContractParam.
   * @param {string} value - A string.
   * @return {ContractParam}
   */
  static string (value) {
    return new ContractParam('String', value)
  }

  /**
   * Creates a Boolean ContractParam. Does basic checks to convert value into a boolean.
   * @param {any} value - A value that can be converted to a boolean
   * @return {ContractParam}
   */
  static boolean (value) {
    return new ContractParam('Boolean', !!value)
  }

  /**
   * Creates a Hash160 ContractParam. This is used for containing a scriptHash. Do not reverse the input if using this format.
   * @param {string} value - A 40 character long hexstring. Automatically converts an address to scripthash if provided.
   * @return {ContractParam}
   */
  static hash160 (value) {
    if (typeof value !== 'string') throw new Error(`Input should be string!`)
    if (isAddress(value)) value = getScriptHashFromAddress(value)
    if (value.length !== 40) throw new Error(`Input should be 40 characters long!`)
    return new ContractParam('Hash160', value)
  }

  /**
   * Creates an Integer ContractParam. Does basic parsing and rounding to convert value into an Integer.
   * @param {any} value - A value that can be parsed to an Integer using parseInt.
   * @return {ContractParam}
   */
  static integer (value) {
    return new ContractParam('Integer', Math.round(parseInt(value, 10)))
  }

  /**
   * Creates a ByteArray ContractParam.
   * @param {any} value
   * @param {string} format - The format that this value represents. Different formats are parsed differently.
   * @return {ContractParam}
   */
  static byteArray (value, format) {
    if (format) format = format.toLowerCase()
    if (format === 'address') {
      return new ContractParam('ByteArray', reverseHex(getScriptHashFromAddress(value)))
    } else if (format === 'fixed8') {
      return new ContractParam('ByteArray', num2fixed8(value))
    } else {
      return new ContractParam('ByteArray', value)
    }
  }

  /**
   * Creates an Array ContractParam.
   * @param {any} params - params to be encapsulated in an array.
   * @return {ContractParam}
   */
  static array (...params) {
    return new ContractParam('Array', params)
  }
}

export default ContractParam
