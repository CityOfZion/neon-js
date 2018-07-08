import { Network } from "./rpc";
import { defaultCalculationStrategy } from "./tx";

export const networks: { [net: string]: Network } = {};

export { defaultCalculationStrategy };

export let timeout = {
  ping: 2000,
  rpc: 5000
};
/**
 * Attempts to add a new Network to settings. This will fail if attempting to add a Network with the same name unless override is set to true.
 * @param network
 * @param override - Whether to override if network with same name is found.
 * @return Whether the add was successful.
 */
export function addNetwork(network: Network, override = false) {
  if (override && networks[network.name]) {
    return false;
  }
  networks[network.name] = network;
  return true;
}

/**
 * Deletes a Network from settings. Returns false if network is not found.
 * @param name
 * @return Whether a network was removed.
 */
export function removeNetwork(name: string): boolean {
  if (networks[name]) {
    delete networks[name];
    return true;
  }
  return false;
}

export default {
  add: {
    network: (network: Network, override?: boolean) =>
      addNetwork(network, override)
  },
  remove: {
    network: (name: string) => removeNetwork(name)
  }
};
