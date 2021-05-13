import { compareObject, compareUnsortedPlainArrays } from "../helper";
import Protocol, { ProtocolJSON, ProtocolLike } from "./Protocol";

export interface NetworkLike {
  name: string;
  protocol: Partial<ProtocolLike>;
  nodes: any[];
  extra: { [key: string]: string };
}

export interface NetworkJSON {
  Name: string;
  ProtocolConfiguration: ProtocolJSON;
  Nodes: string[];
  ExtraConfiguration: { [key: string]: string };
}

/**
 * Network interface representing a NEO blockchain network.
 * This inherits from the network.protocol file used in the C# implementation and adds in additional configurations.
 * @param config NetworkLike JS object
 */
export class Network {
  public name: string;
  public protocol: Protocol;
  public nodes: string[];
  public extra: { [key: string]: string };

  public constructor(
    config: Partial<NetworkLike & NetworkJSON> = {},
    name = null
  ) {
    this.name = config.Name || config.name || name || "RandomNet";
    const protocolLike = Object.assign(
      {},
      config.protocol || config.ProtocolConfiguration || {}
    );
    this.protocol = new Protocol(protocolLike);
    this.nodes = config.Nodes || config.nodes || [];
    this.extra = Object.assign(
      {},
      config.ExtraConfiguration || config.extra || {}
    );
  }

  /**
   * Exports the class as a JSON format.
   */
  public export(): NetworkJSON {
    return {
      ProtocolConfiguration: this.protocol.export(),
      Name: this.name,
      ExtraConfiguration: this.extra,
      Nodes: this.nodes,
    };
  }

  public equals(other: Partial<NetworkLike & NetworkJSON>): boolean {
    return (
      this.name === other.name &&
      this.protocol.equals(other.protocol || {}) &&
      compareUnsortedPlainArrays(this.nodes, other.nodes || []) &&
      compareObject(this.extra, other.extra || {})
    );
  }
}

export default Network;
