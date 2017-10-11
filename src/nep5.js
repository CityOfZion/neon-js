import ScriptBuilder from './sc'
import { getScriptHashFromAddress } from './wallet'
import { Query, VMExtractor } from './rpc'
import { ab2str, hexstring2ab, reverseHex, fixed82num } from './utils'

/**
 * Queries for NEP5 Token information.
 * @param {string} net
 * @param {string} scriptHash
 * @return {Promise<{name: string, symbol: string, decimals: number, totalSupply: number}>}
 */
export const getTokenInfo = (net, scriptHash) => {
  const sb = new ScriptBuilder()
  sb
    .emitAppCall(scriptHash, 'name')
    .emitAppCall(scriptHash, 'symbol')
    .emitAppCall(scriptHash, 'decimals')
    .emitAppCall(scriptHash, 'totalSupply')
  const script = sb.str
  return Query.invokeScript(net, script, false).parseWith(VMExtractor).execute()
    .then((res) => {
      const [name, symbol, decimals] = res.stack.slice(0, 3).map((v) => ab2str(hexstring2ab(v)))
      // totalSupply is parsed as Fixed8
      const totalSupply = (fixed82num(res.stack[3].value))
      return { name, symbol, decimals, totalSupply }
    })
}

/**
 * Get the token balance of Address from Contract
 * @param {string} net
 * @param {string} scriptHash
 * @param {string} address
 * @return {number}
 */
export const getTokenBalance = (net, scriptHash, address) => {
  const addrScriptHash = reverseHex(getScriptHashFromAddress(address))
  const sb = new ScriptBuilder()
  const script = sb.emitAppCall(scriptHash, 'balanceOf', [addrScriptHash]).str
  return Query.invokeScript(net, script, false).execute()
    .then((res) => {
      return fixed82num(res.stack[0].value)
    })
}
