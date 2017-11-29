import { ScriptBuilder } from '../sc'
import { getScriptHashFromAddress, Account } from '../wallet'
import { Query, VMZip } from '../rpc'
import { reverseHex, fixed82num, hexstring2str } from '../utils'
import { getRPCEndpoint, getBalance } from './neonDB'
import { Transaction } from '../transactions'
import { ASSET_ID } from '../consts'

const parseTokenInfo = VMZip(hexstring2str, hexstring2str, parseInt, fixed82num)

const parseTokenInfoAndBalance = VMZip(hexstring2str, hexstring2str, parseInt, fixed82num, fixed82num)

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
  return Query.invokeScript(script, false).parseWith(parseTokenInfo).execute(net)
    .then((res) => {
      return {
        name: res[0],
        symbol: res[1],
        decimals: res[2],
        totalSupply: res[3]
      }
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
 * Get the token info and also balance if address is provided.
 */
export const getToken = (net, scriptHash, address) => {
  let parser = address ? parseTokenInfoAndBalance : parseTokenInfo
  const sb = new ScriptBuilder()
  sb
    .emitAppCall(scriptHash, 'name')
    .emitAppCall(scriptHash, 'symbol')
    .emitAppCall(scriptHash, 'decimals')
    .emitAppCall(scriptHash, 'totalSupply')
  if (address) {
    const addrScriptHash = reverseHex(getScriptHashFromAddress(address))
    sb.emitAppCall(scriptHash, 'balanceOf', [addrScriptHash])
  }
  const script = sb.str
  return Query.invokeScript(script, false).parseWith(parser).execute(net)
    .then((res) => {
      return {
        name: res[0],
        symbol: res[1],
        decimals: res[2],
        totalSupply: res[3],
        balance: res.length === 5 ? res[4] : null
      }
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
