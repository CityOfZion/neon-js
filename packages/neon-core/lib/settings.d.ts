import { Network } from "./rpc";
import { defaultCalculationStrategy } from "./tx";
export declare const networks: {
    [net: string]: Network;
};
export { defaultCalculationStrategy };
export declare let timeout: {
    ping: number;
    rpc: number;
};
/**
 * Attempts to add a new Network to settings. This will fail if attempting to add a Network with the same name unless override is set to true.
 * @param network
 * @param override - Whether to override if network with same name is found.
 * @return Whether the add was successful.
 */
export declare function addNetwork(network: Network, override?: boolean): boolean;
/**
 * Deletes a Network from settings. Returns false if network is not found.
 * @param name
 * @return Whether a network was removed.
 */
export declare function removeNetwork(name: string): boolean;
declare const _default: {
    add: {
        network: (network: Network, override?: boolean | undefined) => boolean;
    };
    remove: {
        network: (name: string) => boolean;
    };
};
export default _default;
//# sourceMappingURL=settings.d.ts.map