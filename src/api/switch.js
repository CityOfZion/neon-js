import * as neonDB from './neonDB'
import * as neoscan from './neoscan'
import logger from '../logging'
const log = logger('api')

/** This determines which API we should dial.
 * 0 means 100% neoscan
 * 1 means 100% neonDB
 * This is ensure that we do not always hit the failing endpoint.
 */
let apiSwitch = 0
let switchFrozen = false

/**
 * Sets the API switch to the provided value
 * @param {number} netSetting - The new value between 0 and 1 inclusive.
 */
export const setApiSwitch = newSetting => {
  if (newSetting >= 0 && newSetting <= 1) apiSwitch = newSetting
}

/**
 * Sets the freeze setting for the API switch. A frozen switch will not dynamically shift towards the other provider when the main provider fails.
 *  This does not mean that we do not use the other provider. This only means that we will not change our preference for the main provider.
 * @param {bool} newSetting - The new setting for freeze.
 */
export const setSwitchFreeze = newSetting => {
  switchFrozen = !!newSetting
  log.info(`core/setSwitchFreeze API switch is frozen: ${switchFrozen}`)
}

const increaseNeoscanWeight = () => {
  if (!switchFrozen && apiSwitch > 0) {
    apiSwitch -= 0.2
    log.info(`core API Switch increasing weight towards neoscan`)
  }
}

const increaseNeonDBWeight = () => {
  if (!switchFrozen && apiSwitch < 1) {
    apiSwitch += 0.2
    log.info(`core API Switch increasing weight towards neonDB`)
  }
}

/**
 * Load balances a API call according to the API switch. Selects the appropriate provider and sends the call towrads it.
 * @param {function} func - The API call to load balance
 * @param {object} config - The configuration object to pass in to the API function
 */
export const loadBalance = (func, config) => {
  if (Math.random() > apiSwitch) {
    return func(config, neoscan)
      .then(c => {
        increaseNeoscanWeight()
        return c
      })
      .catch(() => {
        increaseNeonDBWeight()
        return func(config, neonDB)
      })
  } else {
    return func(config, neonDB)
      .then(c => {
        increaseNeonDBWeight()
        return c
      })
      .catch(() => {
        increaseNeoscanWeight()
        return func(config, neoscan)
      })
  }
}
