import { StringStream } from '../utils'

export interface scriptParams {
  scriptHash: string,
  operation?: string,
  args?: Array<any> | string | number | boolean,
  useTailCall?: boolean
}

//ContractParam
export class ContractParam {
  constructor(type: string, value: any)

  static string(value: string): ContractParam
  static boolean(value: any): ContractParam
  static hash160(value: string): ContractParam
  static integer(value: any): ContractParam
  static byteArray(value: any, format: string): ContractParam
  static array(param: any[]): ContractParam
}

//opCode
export enum OpCode { }

//ScriptBuilder
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

export function createScript({ scriptHash, operation, args, useTailCall }: scriptParams): string

//index
interface DeployScriptConfig {
  script: string,
  name: string,
  version: string,
  author: string,
  email: string,
  description: string,
  needsStorage?: boolean,
  returnType?: string,
  paramaterList?: string
}

export function generateDeployScript({
  script,
  name,
  version,
  author,
  email,
  description,
  needsStorage,
  returnType,
  paramaterList
}: DeployScriptConfig): string
