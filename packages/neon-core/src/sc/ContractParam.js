import { reverseHex, Fixed8 } from '../utils'
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

  get [Symbol.toStringTag] () {
    return { type: this.type, value: this.value }
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
   * @param {any} args - Additional arguments such as decimal precision
   * @return {ContractParam}
   */
  static byteArray (value, format, ...args) {
    if (format) format = format.toLowerCase()
    if (format === 'address') {
      return new ContractParam('ByteArray', reverseHex(getScriptHashFromAddress(value)))
    } else if (format === 'fixed8') {
      var decimals = 8
      if (args.length === 1) {
        decimals = args[0]
      }
      if (!isFinite(value)) throw new Error(`Input should be number!`)
      const divisor = new Fixed8(Math.pow(10, 8 - decimals))
      const fixed8Value = new Fixed8(value)
      const adjustedValue = fixed8Value.times(Math.pow(10, decimals))
      const modValue = adjustedValue.mod(1)
      if (!modValue.isZero()) throw new Error(`wrong precision: expected ${decimals}`)
      value = fixed8Value.div(divisor)
      return new ContractParam('ByteArray', value.toReverseHex().slice(0, 16))
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
