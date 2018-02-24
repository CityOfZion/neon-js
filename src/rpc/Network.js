import Protocol from './Protocol'
import fs from 'fs'
import logger from './logging'

const log = logger('protocol')

/**
 * Network class modeling a network.
 */
export class Network {
  constructor(config, name = null) {
    this.name = config.Name || config.name || name || 'RandomNet'
    let protocolLike = config.protocol || config.ProtocolConfiguration
    this.protocol = new Protocol(protocolLike)
    this.nodes = config.Nodes || config.nodes || []
    this.extra = config.ExtraConfiguration || config.extra || {}
  }

  static import(jsonLike, name = null) {
    const jsonObj = typeof (jsonString) === 'string' ? JSON.parse(jsonString) : jsonString
    return new Network(jsonObj, name)
  }

  static readFile(filePath, name = null) {
    log.info(`Importing Network file from ${filepath}`)
    return this.import(fs.readFileSync(filepath, 'utf8'), name)
  }

  /**
   * Exports the class as a JSON string. Set protocolOnly to export only the protocol.
   * @param {boolean} [protocolOnly] - Exports only the protocol (usable by NEO node) Defaults to false.
   */
  export(protocolOnly = false) {
    if (protocolOnly) return JSON.stringify({
      ProtocolConfiguration: this.protocol.export()
    })
    return JSON.stringify({
      Name: this.name,
      ProtocolConfiguration: this.protocol.export(),
      ExtraConfiguration: this.extra,
      Nodes: this.nodes
    })
  }

  /**
   * Writes the class to file. This is a synchronous operation.
   * @param {string} filepath The filepath to write the Network to.
   * @param {boolean} [protocolOnly] - exports only the protocol (usable by NEO node). Defaults to false.
   */
  writeFile(filepath, protocolOnly = false) {
    return fs.writeFile(filepath, this.export(protocolOnly), (err) => {
      if (err) throw err
      log.info('Network file written!')
      return true
    })
  }

  /**
   * Updates the nodes in the current list by pinging them for block height.
   * @return {Network} this
   */
  update() {

    return this
  }
}
