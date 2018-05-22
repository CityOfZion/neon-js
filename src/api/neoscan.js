import axios from 'axios'
import { Balance, Claims } from '../wallet'
import { ASSET_ID } from '../consts'
import { Fixed8 } from '../utils'
import { networks, httpsOnly, timeout } from '../settings'
import logger from '../logging'
import RPCClient from '../rpc/client'

const log = logger('api')
export const name = 'neoscan'

var cachedRPC = null

/**
 * Returns the appropriate NeoScan endpoint.
 * @param {string} net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @return {string} - URL
 */
export const getAPIEndpoint = net => {
  if (networks[net]) return networks[net].extra.neoscan
  return net
}

/**
 * Returns an appropriate RPC endpoint retrieved from a NeoScan endpoint.
 * @param {string} net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @return {Promise<string>} - URL
 */
export const getRPCEndpoint = net => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_all_nodes').then(({ data }) => {
    let bestHeight = 0
    let nodes = []
    for (const node of data) {
      if (httpsOnly && !node.url.includes('https://')) continue
      if (node.height > bestHeight) {
        bestHeight = node.height
        nodes = [node]
      } else if (node.height + 1 >= bestHeight) {
        nodes.push(node)
      }
    }
    if (nodes.length === 0) throw new Error('No eligible nodes found!')
    var urls = nodes.map(n => n.url)
    if (urls.includes(cachedRPC)) {
      return new RPCClient(cachedRPC).ping().then(num => {
        if (num <= timeout.ping) return cachedRPC
        cachedRPC = null
        return getRPCEndpoint(net)
      })
    }
    var clients = urls.map(u => new RPCClient(u))
    return Promise.race(clients.map(c => c.ping().then(_ => c.net)))
  })
    .then(fastestUrl => {
      cachedRPC = fastestUrl
      return fastestUrl
    })
}

/**
 * Gat balances for an address.
 * @param {string} net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param {string} address - Address to check.
 * @return {Promise<Balance>}
 */
export const getBalance = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_balance/' + address).then(res => {
    if (res.data.address !== address && res.data.balance === null) return new Balance({ address: res.data.address })
    const bal = new Balance({ address: res.data.address, net })
    res.data.balance.map(b => {
      bal.addAsset(b.asset, {
        balance: b.amount,
        unspent: parseUnspent(b.unspent)
      })
    })
    log.info(`Retrieved Balance for ${address} from neoscan ${net}`)
    return bal
  })
}

/**
 * Get claimable amounts for an address.
 * @param {string} net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param {string} address - Address to check.
 * @return {Promise<Claims>}
 */
export const getClaims = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_claimable/' + address).then(res => {
    if (res.address !== address && res.data.claimable === null) return new Claims({ address: res.data.address })
    const claims = parseClaims(res.data.claimable)
    log.info(`Retrieved Balance for ${address} from neoscan ${net}`)
    return new Claims({ net, address: res.data.address, claims })
  })
}

/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param {string} net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param {string} address - Address to check.
 * @return {Promise<Fixed8>}
 */
export const getMaxClaimAmount = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_unclaimed/' + address).then(res => {
    log.info(
      `Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neoscan ${net}`
    )
    return new Fixed8(res.data.unclaimed || 0)
  })
}

const parseUnspent = unspentArr => {
  return unspentArr.map(coin => {
    return {
      index: coin.n,
      txid: coin.txid,
      value: coin.value
    }
  })
}

const parseClaims = claimArr => {
  return claimArr.map(c => {
    return {
      start: new Fixed8(c.start_height),
      end: new Fixed8(c.end_height),
      index: c.n,
      claim: new Fixed8(c.unclaimed),
      txid: c.txid,
      value: c.value
    }
  })
}

/**
 * Get the current height of the light wallet DB
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @return {Promise<number>} Current height.
 */
export const getWalletDBHeight = net => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_height').then(response => {
    return parseInt(response.data.height)
  })
}

/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} A listof PastTransactionPastTransaction[]
 */
export const getTransactionHistory = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios
    .get(apiEndpoint + '/v1/get_last_transactions_by_address/' + address)
    .then(response => {
      log.info(`Retrieved History for ${address} from neoscan ${net}`)
      return parseTxHistory(response.data, address)
    })
}

function parseTxHistory (rawTxs, address) {
  return rawTxs.map(tx => {
    const vin = tx.vin.filter(i => i.address_hash === address)
    const vout = tx.vouts.filter(o => o.address_hash === address)
    const change = {
      NEO: vin.filter(i => i.asset === ASSET_ID.NEO).reduce((p, c) => p.add(c.value), new Fixed8(0)),
      GAS: vout.filter(i => i.asset === ASSET_ID.GAS).reduce((p, c) => p.add(c.value), new Fixed8(0))
    }
    return {
      txid: tx.txid,
      blockHeight: new Fixed8(tx.block_height),
      change
    }
  })
}
