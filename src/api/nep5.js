import { ScriptBuilder } from '../sc'
import { getScriptHashFromAddress, Account } from '../wallet'
import { Query, VMZip } from '../rpc'
import { reverseHex, hexstring2str } from '../utils'
import { getRPCEndpoint, getBalance } from './neonDB'
import { Transaction } from '../transactions'
import { ASSET_ID } from '../consts'
import logger from '../logging'

const log = logger('api')
/**
 * Parses the VM output for decimals. The VM returns an integer for most cases but it can be an empty string for zero.
 */
const parseDecimals = (VMOutput) => {
  if (VMOutput === '') return 0
  return parseInt(VMOutput, 10)
}
const parseHexNum = (hex) => hex ? parseInt(reverseHex(hex), 16) : 0

const parseTokenInfo = VMZip(hexstring2str, hexstring2str, parseDecimals, parseHexNum)

const parseTokenInfoAndBalance = VMZip(hexstring2str, hexstring2str, parseDecimals, parseHexNum, parseHexNum)
/**
 * Queries for NEP5 Token information.
 * @param {string} url - URL of the NEO node to query.
 * @param {string} scriptHash - Contract scriptHash.
 * @return {Promise<{name: string, symbol: string, decimals: number, totalSupply: number}>}
 */
export const getTokenInfo = (url, scriptHash) => {
  const sb = new ScriptBuilder()
  sb
    .emitAppCall(scriptHash, 'name')
    .emitAppCall(scriptHash, 'symbol')
    .emitAppCall(scriptHash, 'decimals')
    .emitAppCall(scriptHash, 'totalSupply')
  const script = sb.str
  return Query.invokeScript(script, false).parseWith(parseTokenInfo).execute(url)
    .then((res) => {
      return {
        name: res[0],
        symbol: res[1],
        decimals: res[2],
        totalSupply: res[3] / Math.pow(10, res[2])
      }
    })
    .catch(err => {
      log.error(`getTokenInfo failed with : ${err.message}`)
      throw err
    })
}

/**
 * Get the token balance of Address from Contract
 * @param {string} url - URL of the NEO node to query.
 * @param {string} scriptHash - Contract scriptHash.
 * @param {string} address - Address to query for balance of tokens.
 * @return {Promise<number>}
 */
export const getTokenBalance = (url, scriptHash, address) => {
  const addrScriptHash = reverseHex(getScriptHashFromAddress(address))
  const sb = new ScriptBuilder()
  const script =
    sb
      .emitAppCall(scriptHash, 'decimals')
      .emitAppCall(scriptHash, 'balanceOf', [addrScriptHash])
      .str
  return Query.invokeScript(script, false).execute(url)
    .then((res) => {
      try {
        const decimals = parseDecimals(res.result.stack[0].value)
        return parseHexNum(res.result.stack[1].value) / Math.pow(10, decimals)
      } catch (error) {
        return 0
      }
    })
    .catch(err => {
      log.error(`getTokenBalance failed with : ${err.message}`)
      throw err
    })
}

/**
 * Get the token info and also balance if address is provided.
 * @param {string} url - URL of the NEO node to query.
 * @param {string} scriptHash - Contract scriptHash.
 * @param {string} [address] - Address to query for balance of tokens.
 * @return {Promise<object>} Object containing name, symbol, decimals, totalSupply. balance will be included if address is provided.
 */
export const getToken = (url, scriptHash, address) => {
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
  return Query.invokeScript(script, false).parseWith(parser).execute(url)
    .then((res) => {
      return {
        name: res[0],
        symbol: res[1],
        decimals: res[2],
        totalSupply: res[3] / Math.pow(10, res[2]),
        balance: res.length === 5 ? res[4] / Math.pow(10, res[2]) : null
      }
    })
    .catch(err => {
      log.error(`getToken failed with : ${err.message}`)
      throw err
    })
}

/**
 * Transfers NEP5 Tokens.
 * @param {string} net - 'MainNet', 'TestNet' or a custom NeonDB url.
 * @param {string} scriptHash - Contract scriptHash
 * @param {string} fromWif - WIF key of the address where the tokens are coming from.
 * @param {string} toAddress - The address to send the tokens to.
 * @param {number} transferAmount - Amount to transfer. This number will be divided by 100000000.
 * @param {number} gasCost - Amount of gas to pay for transfer.
 * @param {function} [signingFunction] - Optional external signing function.
 * @return {Promise<Response>} RPC response
 */
export const doTransferToken = (net, scriptHash, fromWif, toAddress, transferAmount, gasCost = 0, signingFunction = null) => {
  log.warn('doTransferToken will be deprecated in favor of doInvoke')
  const account = new Account(fromWif)
  const rpcEndpointPromise = getRPCEndpoint(net)
  const balancePromise = getBalance(net, account.address)
  let signedTx
  let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then((values) => {
      endpt = values[0]
      const balances = values[1]
      const fromAddrScriptHash = getScriptHashFromAddress(account.address)
      const toAddrScriptHash = reverseHex(getScriptHashFromAddress(toAddress))
      const intents = [
        { assetId: ASSET_ID.GAS, value: 0.00000001, scriptHash: fromAddrScriptHash }
      ]
      const invoke = { scriptHash, operation: 'transfer', args: [reverseHex(fromAddrScriptHash), toAddrScriptHash, transferAmount] }
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
        res.txid = signedTx.hash
      }
      return res
    })
}
