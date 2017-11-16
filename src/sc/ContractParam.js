import { num2fixed8, reverseHex } from '../utils'
import { getScriptHashFromAddress } from '../wallet'

class ContractParam {
  constructor (type, value) {
    this.type = type
    this.value = value
  }

  static String (value) {
    return new ContractParam('String', value)
  }

  static Boolean (value) {
    return new ContractParam('Boolean', !!value)
  }

  static Integer (value) {
    return new ContractParam('Integer', Math.round(parseInt(value, 10)))
  }

  static ByteArray (value, from) {
    if (from === 'Address') {
      return new ContractParam('ByteArray', reverseHex(getScriptHashFromAddress(value)))
    } else if (from === 'Fixed8') {
      return new ContractParam('ByteArray', num2fixed8(value))
    } else {
      return new ContractParam('ByteArray', value)
    }
  }
}

export default ContractParam
