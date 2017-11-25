import { ScriptBuilder } from '../sc'
import { getScriptHashFromAddress, Account } from '../wallet'
import { Query, VMExtractor } from '../rpc'
import { ab2str, hexstring2ab, reverseHex, fixed82num } from '../utils'
import { getRPCEndpoint, getBalance } from './neonDB'
import { Transaction } from '../transactions'
import { ASSET_ID } from '../consts'

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
  return Query.invokeScript(script, false).parseWith(VMExtractor).execute(net)
    .then((res) => {
      const [name, symbol] = res.slice(0, 2).map((v) => ab2str(hexstring2ab(v)))
      // decimals is returned as a Int and just needs to be converted to a number
      const decimals = parseInt(res[2], 10)
      // totalSupply is parsed as Fixed8
      const totalSupply = (fixed82num(res[3]))
      return { name, symbol, decimals, totalSupply }
    })
}

/**
 * Get the token balance of Address from Contract
 * @param {string} net
 * @param {string} scriptHash
 * @param {string} address
 * @return {Promise<number>}
 */
export const getTokenBalance = (net, scriptHash, address) => {
  const addrScriptHash = reverseHex(getScriptHashFromAddress(address))
  const sb = new ScriptBuilder()
  const script = sb.emitAppCall(scriptHash, 'balanceOf', [addrScriptHash]).str
  return Query.invokeScript(script, false).execute(net)
    .then((res) => {
      return fixed82num(res.result.stack[0].value)
    })
}

/**
 * Transfers NEP5 Tokens.
 * @param {string} net
 * @param {string} scriptHash
 * @param {string} fromWif
 * @param {string} toAddress
 * @param {number} transferAmount
 * @param {number} gasCost
 * @param {function} signingFunction
 * @return {Promise<Response>} RPC response
 */
export const doTransferToken = (net, scriptHash, fromWif, toAddress, transferAmount, gasCost = 0, signingFunction = null) => {
  const account = new Account(fromWif)
  const rpcEndpointPromise = getRPCEndpoint(net)
  const balancePromise = getBalance(net, account.address)
  let signedTx
  let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then((values) => {
      endpt = values[0]
      const balances = values[1]
      const fromAddrScriptHash = reverseHex(getScriptHashFromAddress(account.address))
      const intents = [
        { assetId: ASSET_ID.GAS, value: 0.00000001, scriptHash: fromAddrScriptHash }
      ]
      const toAddrScriptHash = reverseHex(getScriptHashFromAddress(toAddress))
      const invoke = { scriptHash, operation: 'transfer', args: [fromAddrScriptHash, toAddrScriptHash, transferAmount] }
      const unsignedTx = Transaction.createInvocationTx(balances, intents, invoke, gasCost, { version: 1 })
      if (signingFunction) {
        return signingFunction(unsignedTx, account.publicKey)
      } else {
        return unsignedTx.sign(account.privateKey)
      }
    })
    .then((signedResult) => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then((res) => {
      if (res.result === true) {
        res.txid = signedTx
      }
      return res
    })
}
