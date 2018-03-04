import { StringStream } from '../../utils'
import { ContractParam } from './ContractParam';
import { OpCode } from './OpCode';

export class ScriptBuilder extends StringStream {
  constructor()

  _emitAppCall(scriptHash: string, useTailCall?: boolean): this
  _emitArray(arr: Array<any>): this
  _emitString(hexstring: string): this
  _emitNum(num: number): this
  _emitParam(param: ContractParam): this

  emit(op: OpCode, args: string): this
  emitAppCall(
    scriptHash: string,
    operation: string,
    args: Array<any> | string | number | boolean,
    useTailCall?: boolean): this
  emitSysCall(api: string): this
  emitPush(data: Array<any> | string | number | boolean): this
}
