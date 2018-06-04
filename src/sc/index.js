import OpCode from './opCode'
import ScriptBuilder from './ScriptBuilder'
import ContractParam from './ContractParam'
import * as core from './core'
import deserialize from './deserialize'

export default {
  create: {
    contractParam: (...args) => new ContractParam(...args),
    script: core.createScript,
    scriptBuilder: (...args) => new ScriptBuilder(...args),
    deployScript: (...args) => core.generateDeployScript(...args)
  }
}
export * from './core'
export { ContractParam, OpCode, ScriptBuilder, deserialize }
