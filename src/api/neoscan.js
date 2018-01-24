import axios from 'axios'
import { Balance, Claims } from '../wallet'
import { ASSETS, ASSET_ID } from '../consts'
import { Fixed8 } from '../utils'
import logger from '../logging'

const log = logger('api')
export const name = 'neoscan'
/**
 * Returns the appropriate NeoScan endpoint.
 * @param {string} net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @return {string} - URL
 */
export const getAPIEndpoint = net => {
  switch (net) {
    case 'MainNet':
      return 'https://api.neoscan.io/api/main_net'
    case 'TestNet':
      return 'https://neoscan-testnet.io/api/test_net'
    default:
      return net
  }
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
      if (node.height > bestHeight) {
        bestHeight = node.height
        nodes = [node]
      } else if (node.height === bestHeight) {
        nodes.push(node)
      }
    }
    const selectedURL = nodes[Math.floor(Math.random() * nodes.length)].url
    log.info(`Best node from neoscan ${net}: ${selectedURL}`)
    return selectedURL
  })
}

/**
 * Gat balances for an address.
 * @param {string} net - 'MainNet', 'TestNet' or a custom NeoScan-like url.
 * @param {string} address - Address to check.
 * @return {Balance}
 */
export const getBalance = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_balance/' + address).then(res => {
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
 * @return {Promise<Claim>}
 */
export const getClaims = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_claimable/' + address).then(res => {
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
  return axios.get(apiEndpoint + '/v1/get_claimable/' + address).then(res => {
    log.info(
      `Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neoscan ${net}`
    )
    return new Fixed8(res.data.unclaimed)
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
 * @return {Promise<History>} History
 */
export const getTransactionHistory = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios
    .get(apiEndpoint + '/v1/get_address_neon/' + address)
    .then(response => {
      log.info(`Retrieved History for ${address} from neoscan ${net}`)
      return parseTxHistory(response.data.txids)
    })
}
/* eslint-disable camelcase */
const parseTxHistory = txids =>
  txids.map(({ txid, block_height, balance, asset_moved }) => {
    let gas_sent = false
    let neo_sent = false
    let GAS = ASSETS.GAS
    let NEO = ASSETS.NEO
    balance.forEach(({ asset, amount }) => {
      if (asset === GAS) GAS = amount
      if (asset === NEO) NEO = amount
    })
    if (ASSET_ID.GAS === asset_moved) gas_sent = true
    if (ASSET_ID.NEO === asset_moved) neo_sent = true
    return { GAS, NEO, block_index: block_height, gas_sent, neo_sent, txid }
  })
/* eslint-enable camelcase */
