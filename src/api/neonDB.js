import axios from 'axios'
import { Account, Balance, Claims } from '../wallet'
import { Transaction, TxAttrUsage } from '../transactions'
import { Query } from '../rpc'
import { ASSET_ID } from '../consts'
import { Fixed8, reverseHex } from '../utils'
import logger from '../logging'

const log = logger('api')
export const name = 'neonDB'
/**
 * API Switch for MainNet and TestNet
 * @param {string} net - 'MainNet', 'TestNet', or custom neon-wallet-db URL.
 * @return {string} URL of API endpoint.
 */
export const getAPIEndpoint = net => {
  switch (net) {
    case 'MainNet':
      return 'http://api.wallet.cityofzion.io'
    case 'TestNet':
      return 'http://testnet-api.wallet.cityofzion.io'
    default:
      return net
  }
}
/**
 * Get balances of NEO and GAS for an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Balance>} Balance of address
 */
export const getBalance = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/balance/' + address).then(res => {
    const bal = new Balance({ net, address: res.data.address })
    Object.keys(res.data).map(key => {
      if (key === 'net' || key === 'address') return
      bal.addAsset(key, res.data[key])
    })
    log.info(`Retrieved Balance for ${address} from neonDB ${net}`)
    return bal
  })
}

/**
 * Get amounts of available (spent) and unavailable claims.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Claim>} An object with available and unavailable GAS amounts.
 */
export const getClaims = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/claims/' + address).then(res => {
    const claimData = res.data
    claimData.claims = claimData.claims.map(c => {
      return {
        claim: new Fixed8(c.claim).div(100000000),
        index: c.index,
        txid: c.txid,
        start: new Fixed8(c.start),
        end: new Fixed8(c.end),
        value: c.value
      }
    })
    log.info(`Retrieved Claims for ${address} from neonDB ${net}`)
    return new Claims(claimData)
  })
}

/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<Fixed8>} An object with available and unavailable GAS amounts.
 */
export const getMaxClaimAmount = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/address/claims/' + address).then(res => {
    log.info(
      `Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neonDB ${net}`
    )
    return new Fixed8(res.data.total_claim + res.data.total_unspent_claim).div(
      100000000
    )
  })
}

/**
 * Returns the best performing (highest block + fastest) node RPC.
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<string>} The URL of the best performing node.
 */
export const getRPCEndpoint = net => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/network/best_node').then(response => {
    log.info(`Best node from neonDB ${net}: ${response.data.node}`)
    return response.data.node
  })
}

/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<History>} History
 */
export const getTransactionHistory = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios
    .get(apiEndpoint + '/v2/address/history/' + address)
    .then(response => {
      log.info(`Retrieved History for ${address} from neonDB ${net}`)
      return response.data.history
    })
}

/**
 * Get the current height of the light wallet DB
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<number>} Current height.
 */
export const getWalletDBHeight = net => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v2/block/height').then(response => {
    return parseInt(response.data.block_height)
  })
}

/**
 * Perform a ClaimTransaction for all available GAS based on API
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} privateKey - Private Key or WIF.
 * @param {function} [signingFunction] - Optional async signing function. Used for external signing.
 * @return {Promise<Response>} RPC response from sending transaction
 */
export const doClaimAllGas = (net, privateKey, signingFunction) => {
  log.warn('doClaimAllGas will be deprecated in favor of claimGas')
  const account = new Account(privateKey)
  const rpcEndpointPromise = getRPCEndpoint(net)
  const claimsPromise = getClaims(net, account.address)
  let signedTx // Scope this outside so that all promises have this
  let endpt
  return Promise.all([rpcEndpointPromise, claimsPromise])
    .then(values => {
      endpt = values[0]
      const claims = values[1]
      if (claims.length === 0) throw new Error('No claimable gas!')
      const unsignedTx = Transaction.createClaimTx(account.publicKey, claims)
      if (signingFunction) {
        return signingFunction(unsignedTx, account.publicKey)
      } else {
        return unsignedTx.sign(account.privateKey)
      }
    })
    .then(signedResult => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then(res => {
      if (res.result === true) {
        res.txid = signedTx
      } else {
        log.error(`Transaction failed: ${signedTx.serialize()}`)
      }
      return res
    })
}

/**
 * Call mintTokens for RPX
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} scriptHash - Contract scriptHash.
 * @param {string} fromWif - The WIF key of the originating address.
 * @param {number} neo - The amount of neo to send to RPX.
 * @param {number} gasCost - The Gas to send as SC fee.
 * @return {Promise<Response>} RPC Response
 */
export const doMintTokens = (net, scriptHash, fromWif, neo, gasCost, signingFunction) => {
  log.warn('doMintTokens will be deprecated in favor of doInvoke')
  const account = new Account(fromWif)
  const intents = [
    { assetId: ASSET_ID.NEO, value: neo, scriptHash: scriptHash }
  ]
  const invoke = { operation: 'mintTokens', scriptHash, args: [] }
  const rpcEndpointPromise = getRPCEndpoint(net)
  const balancePromise = getBalance(net, account.address)
  let signedTx
  let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then(values => {
      endpt = values[0]
      let balances = values[1]
      const attributes = [
        {
          data: reverseHex(scriptHash),
          usage: TxAttrUsage.Script
        }
      ]
      const unsignedTx = Transaction.createInvocationTx(balances, intents, invoke, gasCost, { attributes })
      if (signingFunction) {
        return signingFunction(unsignedTx, account.publicKey)
      } else {
        return unsignedTx.sign(account.privateKey)
      }
    })
    .then(signedResult => {
      signedTx = signedResult
      return Query.getContractState(scriptHash).execute(endpt)
    })
    .then(contractState => {
      const attachInvokedContract = {
        invocationScript: '0000',
        verificationScript: contractState.result.script
      }
      signedTx.scripts.unshift(attachInvokedContract)
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then(res => {
      if (res.result === true) {
        res.txid = signedTx.hash
      } else {
        log.error(`Transaction failed: ${signedTx.serialize()}`)
      }
      return res
    })
}
/**
 * Send an asset to an address
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} toAddress - The destination address.
 * @param {string} from - Private Key or WIF of the sending address.
 * @param {{NEO: number, GAS: number}} assetAmounts - The amount of each asset (NEO and GAS) to send, leave empty for 0.
 * @param {function} [signingFunction] - Optional signing function. Used for external signing.
 * @return {Promise<Response>} RPC Response
 */
export const doSendAsset = (net, toAddress, from, assetAmounts, signingFunction) => {
  log.warn('doSendAsset will be deprecated in favor of sendAsset')
  const fromAcct = new Account(from)
  const toAcct = new Account(toAddress)
  const rpcEndpointPromise = getRPCEndpoint(net)
  const balancePromise = getBalance(net, fromAcct.address)
  const intents = Object.keys(assetAmounts).map(key => {
    return {
      assetId: ASSET_ID[key],
      value: assetAmounts[key],
      scriptHash: toAcct.scriptHash
    }
  })
  let signedTx
  let endpt
  return Promise.all([rpcEndpointPromise, balancePromise])
    .then(values => {
      endpt = values[0]
      const balance = values[1]
      const unsignedTx = Transaction.createContractTx(balance, intents)
      if (signingFunction) {
        return signingFunction(unsignedTx, fromAcct.publicKey)
      } else {
        return unsignedTx.sign(fromAcct.privateKey)
      }
    })
    .then(signedResult => {
      signedTx = signedResult
      return Query.sendRawTransaction(signedTx).execute(endpt)
    })
    .then(res => {
      if (res.result === true) {
        res.txid = signedTx.hash
      } else {
        log.error(`Transaction failed: ${signedTx.serialize()}`)
      }
      return res
    })
}
