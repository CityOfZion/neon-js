import { StringStream, num2hexstring, reverseHex, int2hex, hex2bytes } from '../utils.js'
import OpCode from './opCode.js'

export default class ScriptBuilder extends StringStream {
  /**
   * Appends a AppCall and scriptHash. Used to end off a script.
   * @param {string} scriptHash - Hexstring(BE)
   * @param {boolean} useTailCall - Defaults to false
   * @return {ScriptBuilder} this
   */
  _emitAppCall (scriptHash, useTailCall = false) {
    if (scriptHash.length !== 40) throw new Error()
    return this.emit(useTailCall ? OpCode.TAILCALL : OpCode.APPCALL, reverseHex(scriptHash))
  }

  /**
   * Private method to append an array
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
   * @param {string} hexstring - Hexstring(BE)
   * @return {ScriptBuilder} this
   */
  _emitString (hexstring) {
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
      this.str += num2hexstring(size, 4)
      this.str += hexstring
    } else {
      this.emit(OpCode.PUSHDATA4)
      this.str += num2hexstring(size, 8)
      this.str += hexstring
    }
    return this
  }

  /**
   * Private method to append a number.
   * @param {number} num
   * @return {ScriptBuilder} this
   */
  _emitNum (num) {
    if (num === -1) return this.emit(OpCode.PUSHM1)
    if (num === 0) return this.emit(OpCode.PUSH0)
    if (num > 0 && num <= 16) return this.emit(OpCode.PUSH1 - 1 + num)
    return this.emitPush(hex2bytes(int2hex(num), true).join(''))
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
   * Appends data depending on type. Used to append params/array lengths.
   * @param {Array|string|number|boolean} data
   * @return {ScriptBuilder} this
   */
  emitPush (data) {
    switch (typeof (data)) {
      case 'boolean':
        return this.emit(data ? OpCode.PUSHT : OpCode.PUSHF)
      case 'string':
        return this._emitString(data)
      case 'number':
        return this._emitNum(data)
      case 'object':
        return this._emitArray(data)
      case 'undefined':
        return this.emitPush(false)
      default:
        throw new Error()
    }
  }
}

export const buildScript = ({ scriptHash, operation = null, args = undefined, useTailCall = false }) => {
  const sb = new ScriptBuilder()
  return sb.emitAppCall(scriptHash, operation, args, useTailCall).str
}
