import { StringStream } from '../../utils'
import { ContractParam } from './ContractParam';
import { OpCode } from './OpCode';
import { scriptParams } from './core';


/**uilds a VM script in hexstring. Used for constructing smart contract method calls. */
export class ScriptBuilder extends StringStream {
  constructor()

  /** Appends a AppCall and scriptHash. Used to end off a script. */
  _emitAppCall(scriptHash: string, useTailCall?: boolean): this

  /** Private method to append an array */
  _emitArray(arr: Array<any>): this

  /** Private method to append a hexstring. */
  _emitString(hexstring: string): this

  /** Private method to append a number. */
  _emitNum(num: number): this

  /** Private method to append a ContractParam */
  _emitParam(param: ContractParam): this

  /** Appends an Opcode, followed by args */
  emit(op: OpCode, args: string): this

  /** Appends args, operation and scriptHash */
  emitAppCall(
    scriptHash: string,
    operation?: string,
    args?: Array<any> | string | number | boolean,
    useTailCall?: boolean): this

  /** Appends a SysCall */
  emitSysCall(api: string): this

  /** Appends data depending on type. Used to append params/array lengths. */
  emitPush(data: Array<any> | string | number | boolean): this

  /**Reverse engineer a script back to its params. */
  toScriptParams(): scriptParams[]
}
