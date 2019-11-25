import Protocol, { ProtocolJSON, ProtocolLike } from "./Protocol";
import { NeonObject } from "../model";

export interface NetworkLike {
  name: string;
  protocol: Partial<ProtocolLike>;
  nodes: string[];
  extra: { [key: string]: string };
}

/**
 * This is a expanded interface of protocol.json file found in the C# implementation.
 */
export interface NetworkJSON {
  Name: string;
  ProtocolConfiguration: ProtocolJSON;
  Nodes: string[];
  ExtraConfiguration: { [key: string]: string };
}

function compareStrings(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(curr => b.indexOf(curr) >= 0);
}

function compareMaps(
  a: { [key: string]: string },
  b: { [key: string]: string }
): boolean {
  const keys = Array.from(a.keys ?? []);
  if (!compareStrings(keys, Array.from(b.keys ?? []))) return false;
  return keys.every(key => a[key] === b[key]);
}

/**
 * Network interface representing a NEO blockchain network.
 * This inherits from the network.protocol file used in the C# implementation and adds in additional configurations.
 * @param config NetworkLike JS object
 */
export class Network implements NeonObject<NetworkLike> {
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
  public export(): NetworkLike {
    return {
      name: this.name,
      protocol: this.protocol.export(),
      extra: this.extra,
      nodes: this.nodes
    };
  }

  /**
   * Exports using PascalCase convention for keys.
   */
  public toConfiguration(): NetworkJSON {
    return {
      Name: this.name,
      ProtocolConfiguration: this.protocol.toConfiguration(),
      ExtraConfiguration: this.extra,
      Nodes: this.nodes
    };
  }

  public equals(other: Partial<NetworkLike>): boolean {
    return (
      this.name === other.name &&
      this.protocol.equals(other.protocol ?? {}) &&
      compareStrings(this.nodes, other.nodes ?? []) &&
      compareMaps(this.extra, other.extra ?? {})
    );
  }
}

export default Network;
