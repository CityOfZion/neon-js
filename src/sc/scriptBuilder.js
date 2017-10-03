import { StringStream, num2hexstring } from '../utils.js'
import OpCode from './opCode.js'
export default class ScriptBuilder extends StringStream {
  /**
   * Appends a AppCall and scriptHash. Used to end off a script.
   * @param {string} scriptHash
   * @param {boolean} useTailCall - Defaults to false
   * @return {ScriptBuilder} this
   */
  _emitAppCall (scriptHash, useTailCall = false) {
    if (scriptHash.length !== 40) throw new Error()
    return this.emit(useTailCall ? OpCode.TAILCALL : OpCode.APPCALL, scriptHash)
  }

  /**
   * Private method to append a hexstring.
   * @param {string} hexstring
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
    return this.emitPush(num.toString(16))
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
   * @param {string} scriptHash - Hexstring
   * @param {string} operation - ASCII
   * @param {string[]} args - hexstring[]
   * @return {ScriptBuilder} this
   */
  emitAppCall (scriptHash, operation, args) {
    if (args) {
      for (let i = args.length - 1; i >= 0; i--) {
        this.emitPush(args[i])
      }
      this.emitPush(args.length)
      this.emit(OpCode.PACK)
    } else {
      this.emitPush(false)
    }
    let hexOp = ''
    for (let i = 0; i < operation.length; i++) {
      hexOp += num2hexstring(operation.charCodeAt(i))
    }
    this.emitPush(hexOp)
    this._emitAppCall(scriptHash)
    return this
  }

  /**
   * Appends data depending on type. Used to append params/array lengths.
   * @param {boolean|string|number} data
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
      default:
        throw new Error()
    }
  }
}
