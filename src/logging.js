import loglevel from 'loglevel'
import prefix from 'loglevel-plugin-prefix'

loglevel.disableAll()

const fn = (level, logger) => {
  const timestamp = new Date().toUTCString()
  level = level.toUpperCase()
  const name = logger
  return `[${timestamp}] (${name}) ${level}: `
}

export default (label) => {
  const logger = loglevel.getLogger(label)
  prefix.apply(logger, { format: fn })
  return logger
}
export const logger = loglevel
