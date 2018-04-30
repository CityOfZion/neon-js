import defaultNetworks from './networks.json'
import Network from './rpc/Network'
import { balancedApproach } from './transactions/strategy'

export const networks = {}
Object.keys(defaultNetworks).map(key => {
  networks[key] = Network.import(defaultNetworks[key])
})

export var httpsOnly = false

export var defaultCalculationStrategy = balancedApproach

export var timeout = {
  ping: 2000,
  rpc: 5000
}
/**
 * Attempts to add a new Network to settings. This will fail if attempting to add a Network with the same name unless override is set to true.
 * @param {Network} network
 * @param {bool} override - Whether to override if network with same name is found.
 * @return {bool} Whether the add was successful.
 */
export const addNetwork = (network, override = false) => {
  if (override && networks[network.name]) return false
  networks[network.name] = network
  return true
}

/**
 * Deletes a Network from settings. Returns false if network is not found.
 * @param {string} name
 * @return {bool} Whether a network was removed.
 */
export const removeNetwork = name => {
  if (networks[name]) {
    delete networks[name]
    return true
  }
  return false
}

export default {
  add: {
    network: (network, override) => addNetwork(network, override)
  },
  remove: {
    network: (name) => removeNetwork(name)
  }
}
