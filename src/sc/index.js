import OpCode from './opCode'
import ScriptBuilder, { createScript } from './ScriptBuilder'
import ContractParam from './ContractParam'
import { str2hexstring } from '../utils.js'

const generateDeployScript = ({script, name, version, author, email, description, needsStorage = false, returnType = 'ff', paramaterList = undefined}) => {
  const sb = new ScriptBuilder()
  sb
    .emitPush(str2hexstring(description))
    .emitPush(str2hexstring(email))
    .emitPush(str2hexstring(author))
    .emitPush(str2hexstring(version))
    .emitPush(str2hexstring(name))
    .emitPush(needsStorage)
    .emitPush(returnType)
    .emitPush(paramaterList)
    .emitPush(script)
    .emitSysCall('Neo.Contract.Create')
  return sb
}

export default {
  create: {
    contractParam: (...args) => new ContractParam(...args),
    script: createScript,
    scriptBuilder: (...args) => new ScriptBuilder(...args),
    deployScript: (...args) => generateDeployScript(...args)
  }
}

export { ContractParam, OpCode, ScriptBuilder, createScript, generateDeployScript }
