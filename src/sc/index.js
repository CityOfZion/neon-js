import OpCode from './opCode'
import ScriptBuilder, { createScript } from './scriptBuilder'

export default {
  create: {
    script: createScript,
    scriptBuilder: () => new ScriptBuilder()
  }
}

const generateDeployScript = (script, name, version, author, email, description, needsStorage = false, returnType = "ff", paramaterList= []) => {
  const sb = new ScriptBuilder()
  sb
    .emitPush(description)
    .emitPush(email)
    .emitPush(author)
    .emitPush(version)
    .emitPush(name)
    .emitPush(needsStorage)
    .emitPush(returnType)
    .emitPush(paramaterList)
    .emitPush(script)
    .emitSysCall("Neo.Contract.Create")
  return sb
}

export { OpCode, ScriptBuilder, createScript, generateDeployScript }
