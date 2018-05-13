import axios from 'axios'
import logger from '../logging'

const log = logger('api')

const CURRENCY = ['aud', 'brl', 'cad', 'chf', 'clp', 'cny', 'czk', 'dkk', 'eur', 'gbp', 'hkd', 'huf', 'idr', 'ils', 'inr', 'jpy', 'krw', 'mxn', 'myr', 'nok', 'nzd', 'php', 'pkr', 'pln', 'rub', 'sek', 'sgd', 'thb', 'try', 'twd', 'usd', 'zar']

/**
 * Returns the price of coin in the symbol given
 * @param {string} coin - Coin name. NEO or GAS.
 * @param {string} currency - Three letter currency symbol.
 * @return {Promise<number>} price
 */
export const getPrice = (coin = 'NEO', currency = 'usd') => {
  log.warn(`This is deprecated in favor of getPrices. There is a known bug for NEP5 tokens with this function.`)
  return query(`https://api.coinmarketcap.com/v1/ticker/${coin.toLowerCase()}/`, currency)
    .then((mapping) => {
      const price = mapping[coin.toUpperCase()]
      if (price) return price
      else throw new Error('Something went wrong with the CoinMarketCap API!')
    })
    .catch(err => {
      log.error(err.message)
      throw err
    })
}

/**
 * Returns a mapping of the symbol for a coin to its price
 * @param {string[]} [coins] - Coin names. NEO or GAS.
 * @param {string} [currency] - Three letter currency symbol.
 * @return {Promise<object>} object mapping symbol to price
 */
export const getPrices = (coins = ['NEO'], currency = 'usd') => {
  return query(`https://api.coinmarketcap.com/v1/ticker/`, currency)
    .then((mapping) => {
      coins = coins.map((coin) => coin.toUpperCase())
      const prices = pick(mapping, ...coins)

      if (!coins.some((coin) => !prices[coin])) return prices
      else throw new Error('None of the coin symbols are supported by CoinMarketCap!')
    })
    .catch(err => {
      log.error(err.message)
      throw err
    })
}

function query (url, currency) {
  currency = currency.toLowerCase()

  if (CURRENCY.includes(currency)) {
    return axios.get(`${url}?limit=0&convert=${currency}`)
      .then((response) => {
        const { data } = response
        if (data.error) throw new Error(data.error)
        return mapPrices(data, currency)
      })
  } else {
    return Promise.reject(new ReferenceError(`${currency} is not one of the accepted currencies!`))
  }
}

function mapPrices (tickers, currency) {
  const mapping = {}

  tickers.forEach((ticker) => {
    mapping[ticker.symbol] = parseFloat(ticker[`price_${currency.toLowerCase()}`])
  })

  return mapping
}

function pick (obj, ...props) {
  return Object.assign({}, ...props.map((prop) => ({ [prop]: obj[prop] })))
}
