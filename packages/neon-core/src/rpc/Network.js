import Protocol from './Protocol'
import fs from 'fs'
import logger from '../logging'

const log = logger('protocol')

/**
 * Network interface representing a NEO blockchain network.
 * @param {NetworkLike} config - NetworkLike JS object
 */
export default class Network {
  constructor (config = {}, name = null) {
    this.name = config.Name || config.name || name || 'RandomNet'
    if (name) this.name = name
    let protocolLike = config.protocol || config.ProtocolConfiguration || {}
    this.protocol = new Protocol(protocolLike)
    this.nodes = config.Nodes || config.nodes || []
    this.extra = config.ExtraConfiguration || config.extra || {}
  }

  /**
   * Imports a json object or string. Overrides the network name with the given name if provided.
   * @param {object|string} jsonLike
   * @param {string} [name]
   * @return {Network}
   */
  static import (jsonLike, name = null) {
    const jsonObj = typeof (jsonString) === 'string' ? JSON.parse(jsonLike) : jsonLike
    return new Network(jsonObj, name)
  }

  /**
   * Reads a Network file and imports it.
   * @param {string} filePath
   * @param {string} [name]
   * @returns {Network}
   */
  static readFile (filePath, name = null) {
    log.info(`Importing Network file from ${filePath}`)
    return this.import(fs.readFileSync(filePath, 'utf8'), name)
  }

  /**
   * Exports the class as a JSON string. Set protocolOnly to export only the protocol.
   * @param {boolean} [protocolOnly] - Exports only the protocol (usable by NEO node) Defaults to false.
   * @returns {NetworkLike}
   */
  export (protocolOnly = false) {
    if (protocolOnly) {
      return JSON.stringify({
        ProtocolConfiguration: this.protocol.export()
      })
    }
    return {
      Name: this.name,
      ProtocolConfiguration: this.protocol.export(),
      ExtraConfiguration: this.extra,
      Nodes: this.nodes
    }
  }

  /**
   * Writes the class to file. This is a synchronous operation.
   * @param {string} filepath The filepath to write the Network to.
   * @param {boolean} [protocolOnly] - exports only the protocol (usable by NEO node). Defaults to false.
   * @returns {boolean}
   */
  writeFile (filepath, protocolOnly = false) {
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
  update () {
    return this
  }
}
