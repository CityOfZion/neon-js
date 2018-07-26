"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helper");
const logging_1 = __importDefault(require("../logging"));
const Protocol_1 = __importDefault(require("./Protocol"));
const log = logging_1.default("protocol");
/**
 * Network interface representing a NEO blockchain network.
 * @param config NetworkLike JS object
 */
class Network {
    constructor(config = {}, name = null) {
        this.name = config.Name || config.name || name || "RandomNet";
        const protocolLike = Object.assign({}, config.protocol || config.ProtocolConfiguration || {});
        this.protocol = new Protocol_1.default(protocolLike);
        this.nodes = config.Nodes || config.nodes || [];
        this.extra = Object.assign({}, config.ExtraConfiguration || config.extra || {});
    }
    /**
     * Exports the class as a JSON format.
     */
    export() {
        return {
            ProtocolConfiguration: this.protocol.export(),
            Name: this.name,
            ExtraConfiguration: this.extra,
            Nodes: this.nodes
        };
    }
    equals(other) {
        return (this.name === other.name &&
            this.protocol.equals(other.protocol || {}) &&
            helper_1.compareUnsortedPlainArrays(this.nodes, other.nodes || []) &&
            helper_1.compareObject(this.extra, other.extra || {}));
    }
}
exports.Network = Network;
exports.default = Network;
//# sourceMappingURL=Network.js.map