import OpCode from './opCode'
import ScriptBuilder, { createScript } from './scriptBuilder'

export default {
  create: {
    script: createScript,
    scriptBuilder: () => new ScriptBuilder()
  }
}

export { OpCode, ScriptBuilder, createScript }
