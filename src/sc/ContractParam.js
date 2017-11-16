import { num2fixed8, reverseHex } from '../utils'
import { getScriptHashFromAddress } from '../wallet'

class ContractParam {
  constructor (type, value) {
    this.type = type
    this.value = value
  }

  static string (value) {
    return new ContractParam('String', value)
  }

  static boolean (value) {
    return new ContractParam('Boolean', !!value)
  }

  static integer (value) {
    return new ContractParam('Integer', Math.round(parseInt(value, 10)))
  }

  static byteArray (value, from) {
    if (from) from = from.toLowerCase()
    if (from === 'address') {
      return new ContractParam('ByteArray', reverseHex(getScriptHashFromAddress(value)))
    } else if (from === 'fixed8') {
      return new ContractParam('ByteArray', num2fixed8(value))
    } else {
      return new ContractParam('ByteArray', value)
    }
  }

  static array (...params) {
    return new ContractParam('Array', params)
  }
}

export default ContractParam
