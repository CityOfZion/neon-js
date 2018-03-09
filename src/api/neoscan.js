import axios from 'axios'
import { Balance, Claims } from '../wallet'
import { ASSET_ID } from '../consts'
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
  return axios.get(apiEndpoint + '/v1/get_claimable/' + address).then(res => {
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
    .get(apiEndpoint + '/v1/get_address_neon/' + address)
    .then(response => {
      log.info(`Retrieved History for ${address} from neoscan ${net}`)
      return parseTxHistory(response.data.txids)
    })
}

/* eslint-disable camelcase */
const parseTxHistory = rawTxs => {
  const txs = []
  const lastItem = rawTxs.length - 1
  rawTxs.forEach((tx, ind) => {
    let change
    if (ind !== lastItem) {
      const prevTx = rawTxs[ind + 1]
      const currBal = flattenBalance(tx.balance)
      const prevBal = flattenBalance(prevTx.balance)
      change = {
        NEO: new Fixed8(currBal.NEO || 0).minus(prevBal.NEO || 0),
        GAS: new Fixed8(currBal.GAS || 0).minus(prevBal.GAS || 0)
      }
    } else {
      let symbol = tx.asset_moved === ASSET_ID.NEO ? 'NEO' : 'GAS'
      change = { [symbol]: new Fixed8(tx.amount_moved) }
    }
    txs.push({
      txid: tx.txid,
      blockHeight: tx.block_height,
      change
    })
  })
  return txs
}
/* eslint-enable camelcase */

const flattenBalance = balance => {
  return balance.reduce((bal, asset) => {
    bal[asset.asset] = new Fixed8(asset.amount)
    return bal
  }, {})
}
