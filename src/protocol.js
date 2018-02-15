import { DEFAULT_SYSFEE } from './consts'
import fs from 'fs'
import logger from './logging'

const log = logger('protocol')

class Protocol {
  constructor (config) {
    this.name = config.name || config.Name || 'RandomNet'
    this.magic = config.magic || config.Magic
    this.addressVersion = config.addressVersion || config.AddressVersion || 23
    this.standbyValidators = config.standbyValidators || config.StandbyValidators || []
    this.seedList = config.seedList || config.SeedList || []
    this.systemFee = config.systemFee || config.SystemFee || DEFAULT_SYSFEE
    this.extra = config.extra || config.Extra || {}
  }

  addProperty (key, value) {
    this.extra[key] = value
  }

  static import (jsonLike, name = null) {
    const config = typeof (jsonLike) === 'string' ? JSON.parse(jsonLike) : jsonLike
    return new Protocol(Object.assign(config.ProtocolConfiguration, { extra: config.extra || config.Extra, name: config.name || config.Name || name }))
  }

  static importFile (filepath, name = null) {
    log.info(`Importing protocol file from ${filepath}`)
    return this.import(fs.readFileSync(filepath, 'utf8'), name)
  }

  static writeFile (filepath) {
    return fs.writeFile(filepath, this.export(), (err) => {
      if (err) throw err
      console.log('Protocol file written!')
      return true
    })
  }

  export () {
    return JSON.stringify({
      ProtocolConfiguration: {
        Magic: this.magic,
        AddressVersion: this.addressVersion,
        StandbyValidators: this.standbyValidators,
        SeedList: this.seedList,
        SystemFee: this.systemFee
      },
      Extra: this.extra,
      Name: this.name
    })
  }
}

export default Protocol
