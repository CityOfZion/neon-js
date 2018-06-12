import { Protocol } from './Protocol'
import { RPCClient } from './client'

export interface NetworkLike {
  name?: string
  protocol?: object
  nodes?: string[]
  extra?:  {[key: string]: string}
}

/**
 * A Network object representing a NEO blockchain network
 */
export class Network {
  name: string
  protocol: Protocol
  nodes: RPCClient[]
  extra: object

  constructor(config?: NetworkLike, name?: string)

  /** Imports a Network from a jsonString */
  static import(jsonLike: object, name?: string): Network

  /** Reads a Network file */
  static readFile(filePath: string, name?: string): Network

  /** Export this class as a object */
  export(protocolOnly?: boolean): NetworkLike

  /** Writes this class to a file */
  writeFile(filepath: string, protocolOnly?: boolean): boolean
}
