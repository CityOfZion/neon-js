
export interface ProtocolLike {
  magic?: number
  addressVersion?: number
  standbyValidators?: string[]
  seedList?: string[]
  systemFee?: object
}

/**
 * ProtocolConfiguration as found in protocol.json files
 */
export class Protocol {
  magic: number
  addressVersion: number
  standbyValidators: string[]
  seedList: string[]
  systemFee: object

  constructor(config?: ProtocolLike)

  /** Imports a ProtocolConfiguration object */
  static import(jsonLike: string | object, name?: string): Protocol

  /** Reads a file and imports it as a Protocol object */
  static readFile(filepath: string, name?: string): Protocol

  /** Exports this class as a JS object */
  export(): ProtocolLike

  /** Writes this class to a file */
  writeFile(filepath: string): boolean
}
