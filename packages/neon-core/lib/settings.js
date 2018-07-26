"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tx_1 = require("./tx");
exports.defaultCalculationStrategy = tx_1.defaultCalculationStrategy;
exports.networks = {};
exports.timeout = {
    ping: 2000,
    rpc: 5000
};
/**
 * Attempts to add a new Network to settings. This will fail if attempting to add a Network with the same name unless override is set to true.
 * @param network
 * @param override - Whether to override if network with same name is found.
 * @return Whether the add was successful.
 */
function addNetwork(network, override = false) {
    if (override && exports.networks[network.name]) {
        return false;
    }
    exports.networks[network.name] = network;
    return true;
}
exports.addNetwork = addNetwork;
/**
 * Deletes a Network from settings. Returns false if network is not found.
 * @param name
 * @return Whether a network was removed.
 */
function removeNetwork(name) {
    if (exports.networks[name]) {
        delete exports.networks[name];
        return true;
    }
    return false;
}
exports.removeNetwork = removeNetwork;
exports.default = {
    add: {
        network: (network, override) => addNetwork(network, override)
    },
    remove: {
        network: (name) => removeNetwork(name)
    }
};
//# sourceMappingURL=settings.js.map