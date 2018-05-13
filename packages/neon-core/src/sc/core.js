import { str2hexstring } from '../utils.js'
import ScriptBuilder from './ScriptBuilder'

/**
 * A wrapper method around ScripBuilder for creating a VM script.
 * @param {object} props - Properties passed in as an object.
 * @param {string} props.scriptHash - The contract scriptHash.
 * @param {string} [props.operation=null] - The method name to call.
 * @param {Array} [props.args=undefined] - The arguments of the method to pass in.
 * @param {boolean} [props.useTailCall=false] - To use Tail Call.
 * @return {string} The VM Script.
 */
export const createScript = (...scriptIntents) => {
  if (scriptIntents.length === 1 && Array.isArray(scriptIntents[0])) {
    scriptIntents = scriptIntents[0]
  }
  const sb = new ScriptBuilder()
  for (var scriptIntent of scriptIntents) {
    if (!scriptIntent.scriptHash) throw new Error('No scriptHash found!')
    const { scriptHash, operation, args, useTailCall } = Object.assign({ operation: null, args: undefined, useTailCall: false }, scriptIntent)

    sb.emitAppCall(scriptHash, operation, args, useTailCall)
  }
  return sb.str
}

/**
 * Generates script for deploying contract
 */
export const generateDeployScript = ({ script, name, version, author, email, description, needsStorage = false, returnType = 'ff', parameterList = undefined }) => {
  const sb = new ScriptBuilder()
  sb
    .emitPush(str2hexstring(description))
    .emitPush(str2hexstring(email))
    .emitPush(str2hexstring(author))
    .emitPush(str2hexstring(version))
    .emitPush(str2hexstring(name))
    .emitPush(needsStorage)
    .emitPush(returnType)
    .emitPush(parameterList)
    .emitPush(script)
    .emitSysCall('Neo.Contract.Create')
  return sb
}
