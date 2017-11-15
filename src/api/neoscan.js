import axios from 'axios'

export const getAPIEndpoint = (net) => {
  switch (net) {
    case 'MainNet':
      return 'https://neoscan.io/api/main_net'
    case 'TestNet':
      throw new Error(`Not Implemented`)
    default:
      return net
  }
}

export const getRPCEndpoint = (net) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_all_nodes')
    .then((res) => {
      let bestHeight = 0
      let nodes = []
      for (const node in res.data) {
        if (node.height > bestHeight) {
          bestHeight = node.height
          nodes = [node]
        } else if (node.height === bestHeight) {
          nodes.push(node)
        }
      }
      return nodes[Math.floor(Math.random() * nodes.length)].url
    })
}
/**
 * Gat balances for an address.
 * @param {string} net - 'MainNet' or 'TestNet'
 * @param {string} address - Address to check.
  */
export const getBalance = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_balance/' + address)
    .then((res) => {
      const balances = { address: res.data.address, net }
      res.data.balance.map((b) => {
        balances[b.asset] = {
          balance: b.amount,
          unspent: parseUnspent(b.unspent)
        }
      })
      return balances
    })
}

export const getClaimAmounts = (net, address) => {
  const apiEndpoint = getAPIEndpoint(net)
  return axios.get(apiEndpoint + '/v1/get_claimable/' + address)
    .then((res) => {
      const claims = parseClaims(res.data.claimable)
      return { address: res.data.address, claims }
    })
}

const parseUnspent = (unspentArr) => {
  return unspentArr.map((coin) => {
    return {
      index: coin.n,
      txid: coin.txid,
      value: coin.value
    }
  })
}

const parseClaims = (claimArr) => {
  return claimArr.map((c) => {
    return {
      start: c.start_height,
      end: c.ed_height,
      index: c.n,
      claim: Math.round(c.unclaimed * 100000000),
      txid: c.txid,
      value: c.value
    }
  })
}
