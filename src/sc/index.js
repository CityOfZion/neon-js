import OpCode from './opCode'
import ScriptBuilder, { createScript } from './scriptBuilder'
import { str2hexstring } from '../utils.js'

export default {
  create: {
    script: createScript,
    scriptBuilder: () => new ScriptBuilder()
  }
}

const generateDeployScript = ({script, name, version, author, email, description, needsStorage = false, returnType = "ff", paramaterList= []}) => {
  const sb = new ScriptBuilder()
  sb
    .emitPush(str2hexstring(description))
    .emitPush(str2hexstring(email))
    .emitPush(str2hexstring(author))
    .emitPush(version)
    .emitPush(str2hexstring(name))
    .emitPush(needsStorage)
    .emitPush(returnType)
    .emitPush(paramaterList)
    .emitPush(script)
    .emitSysCall("Neo.Contract.Create")
  return sb
}

export { OpCode, ScriptBuilder, createScript, generateDeployScript }
