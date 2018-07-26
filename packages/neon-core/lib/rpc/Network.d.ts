import Protocol, { ProtocolJSON, ProtocolLike } from "./Protocol";
export interface NetworkLike {
    name: string;
    protocol: Partial<ProtocolLike>;
    nodes: any[];
    extra: {
        [key: string]: string;
    };
}
export interface NetworkJSON {
    Name: string;
    ProtocolConfiguration: ProtocolJSON;
    Nodes: string[];
    ExtraConfiguration: {
        [key: string]: string;
    };
}
/**
 * Network interface representing a NEO blockchain network.
 * @param config NetworkLike JS object
 */
export declare class Network {
    name: string;
    protocol: Protocol;
    nodes: string[];
    extra: {
        [key: string]: string;
    };
    constructor(config?: Partial<NetworkLike & NetworkJSON>, name?: null);
    /**
     * Exports the class as a JSON format.
     */
    export(): NetworkJSON;
    equals(other: Partial<NetworkLike & NetworkJSON>): boolean;
}
export default Network;
//# sourceMappingURL=Network.d.ts.map