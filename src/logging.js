import winston from 'winston'

const format = winston.format

export const transports = {
  info: new winston.transports.Console({ level: 'info', silent: true, colorize: true }),
  warning: new winston.transports.Console({ level: 'warn', silent: true, colorize: true }),
  error: new winston.transports.Console({ level: 'error', silent: true, colorize: true })
  // errorfile: new winston.transports.File({ filename: 'error.log', prettyPrint: true, level: 'error' }),
  // combinedfile: new winston.transports.File({ filename: 'combined.log', prettyPrint: true, level: 'info' })
}

export const logger = winston.createLogger({
  transports: Object.keys(transports).map(key => transports[key]),
  format: format.combine(
    format.timestamp(),
    format.printf(item => `${item.timestamp} [${item.label}] ${item.level}: ${item.message}`)
  )
})

export default (label) => {
  return {
    info: (message) => logger.log({ label, message, level: 'info' }),
    warn: (message) => logger.log({ label, message, level: 'warn' }),
    error: (message) => logger.log({ label, message, level: 'error' })
  }
}
