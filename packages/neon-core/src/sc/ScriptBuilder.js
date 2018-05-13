import { StringStream, num2hexstring, reverseHex, ensureHex, int2hex, str2ab, ab2hexstring, str2hexstring } from '../utils.js'
import OpCode from './opCode.js'

/**
 * @class ScriptBuilder
 * @extends StringStream
 * @classdesc Builds a VM script in hexstring. Used for constructing smart contract method calls.
 */
class ScriptBuilder extends StringStream {
  /**
   * Appends a AppCall and scriptHash. Used to end off a script.
   * @param {string} scriptHash - Hexstring(BE)
   * @param {boolean} useTailCall - Defaults to false
   * @return {ScriptBuilder} this
   */
  _emitAppCall (scriptHash, useTailCall = false) {
    ensureHex(scriptHash)
    if (scriptHash.length !== 40) throw new Error('ScriptHash should be 20 bytes long!')
    return this.emit(useTailCall ? OpCode.TAILCALL : OpCode.APPCALL, reverseHex(scriptHash))
  }

  /**
   * Private method to append an array
   * @private
   * @param {Array} arr
   * @return {ScriptBuilder} this
   */
  _emitArray (arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
      this.emitPush(arr[i])
    }
    return this.emitPush(arr.length).emit(OpCode.PACK)
  }

  /**
   * Private method to append a hexstring.
   * @private
   * @param {string} hexstring - Hexstring(BE)
   * @return {ScriptBuilder} this
   */
  _emitString (hexstring) {
    ensureHex(hexstring)
    const size = hexstring.length / 2
    if (size <= OpCode.PUSHBYTES75) {
      this.str += num2hexstring(size)
      this.str += hexstring
    } else if (size < 0x100) {
      this.emit(OpCode.PUSHDATA1)
      this.str += num2hexstring(size)
      this.str += hexstring
    } else if (size < 0x10000) {
      this.emit(OpCode.PUSHDATA2)
      this.str += num2hexstring(size, 2, true)
      this.str += hexstring
    } else if (size < 0x100000000) {
      this.emit(OpCode.PUSHDATA4)
      this.str += num2hexstring(size, 4, true)
      this.str += hexstring
    } else {
      throw new Error(`String too big to emit!`)
    }
    return this
  }

  /**
   * Private method to append a number.
   * @private
   * @param {number} num
   * @return {ScriptBuilder} this
   */
  _emitNum (num) {
    if (num === -1) return this.emit(OpCode.PUSHM1)
    if (num === 0) return this.emit(OpCode.PUSH0)
    if (num > 0 && num <= 16) return this.emit(OpCode.PUSH1 - 1 + num)
    const hexstring = int2hex(num)
    return this.emitPush(reverseHex('0'.repeat(16 - hexstring.length) + hexstring))
  }

  /**
   * Private method to append a ContractParam
   * @private
   * @param {ContractParam} param
   * @return {ScriptBuilder} this
   */
  _emitParam (param) {
    if (!param.type) throw new Error('No type available!')
    if (!isValidValue(param.value)) throw new Error('Invalid value provided!')
    switch (param.type) {
      case 'String':
        return this._emitString(str2hexstring(param.value))
      case 'Boolean':
        return this.emit(param.value ? OpCode.PUSHT : OpCode.PUSHF)
      case 'Integer':
        return this._emitNum(param.value)
      case 'ByteArray':
        return this._emitString(param.value)
      case 'Array':
        return this._emitArray(param.value)
      case 'Hash160':
        return this._emitString(reverseHex(param.value))
    }
  }

  /**
   * Appends an Opcode, followed by args
   * @param {OpCode} op
   * @param {string} args
   * @return {ScriptBuilder} this
   */
  emit (op, args) {
    this.str += num2hexstring(op)
    if (args) this.str += args
    return this
  }

  /**
   * Appends args, operation and scriptHash
   * @param {string} scriptHash - Hexstring(BE)
   * @param {string|null} operation - ASCII, defaults to null
   * @param {Array|string|number|boolean} args - any
   * @param {boolean} useTailCall - Use TailCall instead of AppCall
   * @return {ScriptBuilder} this
   */
  emitAppCall (scriptHash, operation = null, args = undefined, useTailCall = false) {
    this.emitPush(args)
    if (operation) {
      let hexOp = ''
      for (let i = 0; i < operation.length; i++) {
        hexOp += num2hexstring(operation.charCodeAt(i))
      }
      this.emitPush(hexOp)
    }
    this._emitAppCall(scriptHash, useTailCall)
    return this
  }

  /**
   * Appends a SysCall
   * @param {string} api - api of SysCall
   * @return {ScriptBuilder} this
   */
  emitSysCall (api) {
    if (api === undefined || api === '') throw new Error('Invalid SysCall API')
    const apiBytes = ab2hexstring(str2ab(api))
    const length = int2hex(apiBytes.length / 2)
    if (length.length !== 2) throw new Error('Invalid length for SysCall API')
    const out = length + apiBytes
    return this.emit(OpCode.SYSCALL, out)
  }

  /**
   * Appends data depending on type. Used to append params/array lengths.
   * @param {Array|string|number|boolean} data
   * @return {ScriptBuilder} this
   */
  emitPush (data) {
    if (data == null) return this.emitPush(false)
    switch (typeof (data)) {
      case 'boolean':
        return this.emit(data ? OpCode.PUSHT : OpCode.PUSHF)
      case 'string':
        return this._emitString(data)
      case 'number':
        return this._emitNum(data)
      case 'object':
        if (Array.isArray(data)) {
          return this._emitArray(data)
        } else {
          return this._emitParam(data)
        }
      case 'undefined':
        return this.emitPush(false)
      default:
        throw new Error()
    }
  }

  /**
   * Reverse engineer a script back to its params.
   * @return {scriptParams[]}
   */
  toScriptParams () {
    this.reset()
    const scripts = []
    while (!this.isEmpty()) {
      let a = retrieveAppCall(this)
      if (a) scripts.push(a)
    }
    return scripts
  }
}

const isValidValue = (value) => {
  if (value) {
    return true
  } else if (value === 0) {
    return true
  } else if (value === '') {
    return true
  }
  return false
}

/**
 * Retrieves a single AppCall from a ScriptBuilder object.
 * @param {ScriptBuilder} sb
 * @return {scriptParams}
 */
const retrieveAppCall = (sb) => {
  const output = {
    scriptHash: '',
    args: []
  }

  while (!sb.isEmpty()) {
    let b = sb.read()
    let n = parseInt(b, 16)
    switch (true) {
      case (n === 0):
        output.args.unshift(0)
        break
      case (n < 75):
        output.args.unshift(sb.read(n))
        break
      case (n >= 81 && n <= 96):
        output.args.unshift(n - 80)
        break
      case (n === 193):
        const len = output.args.shift()
        const cache = []
        for (var i = 0; i < len; i++) { cache.unshift(output.args.shift()) }
        output.args.unshift(cache)
        break
      case (n === 102):
        sb.pter = sb.str.length
        break
      case (n === 103):
        output.scriptHash = reverseHex(sb.read(20))
        output.useTailCall = false
        return output
      case (n === 105):
        output.scriptHash = reverseHex(sb.read(20))
        output.useTailCall = true
        return output
      case (n === 241):
        break
      default:
        throw new Error(`Encounter unknown byte: ${b}`)
    }
  }
  if (output.scriptHash !== '') return output
}

export default ScriptBuilder
