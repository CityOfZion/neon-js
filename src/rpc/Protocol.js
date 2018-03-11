import { DEFAULT_SYSFEE } from '../consts'
import fs from 'fs'
import logger from '../logging'

const log = logger('protocol')

class Protocol {
  constructor (config = {}) {
    this.magic = config.magic || config.Magic || 0
    this.addressVersion = config.addressVersion || config.AddressVersion || 23
    this.standbyValidators = config.standbyValidators || config.StandbyValidators || []
    this.seedList = config.seedList || config.SeedList || []
    this.systemFee = config.systemFee || config.SystemFee || DEFAULT_SYSFEE
  }

  static import (jsonLike, name = null) {
    const config = typeof (jsonLike) === 'string' ? JSON.parse(jsonLike) : jsonLike
    return new Protocol(Object.assign(config, { extra: config.extra || config.Extra, name: config.name || config.Name || name }))
  }

  static readFile (filepath, name = null) {
    log.info(`Importing protocol file from ${filepath}`)
    return this.import(fs.readFileSync(filepath, 'utf8'), name)
  }

  writeFile (filepath) {
    return fs.writeFile(filepath, this.export(), (err) => {
      if (err) throw err
      console.log('Protocol file written!')
      return true
    })
  }

  export () {
    return {
      Magic: this.magic,
      AddressVersion: this.addressVersion,
      StandbyValidators: this.standbyValidators,
      SeedList: this.seedList,
      SystemFee: this.systemFee
    }
  }
}

export default Protocol
