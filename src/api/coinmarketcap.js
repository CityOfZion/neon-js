import axios from 'axios'

const CURRENCY = ['aud', 'brl', 'cad', 'chf', 'clp', 'cny', 'czk', 'dkk', 'eur', 'gbp', 'hkd', 'huf', 'idr', 'ils', 'inr', 'jpy', 'krw', 'mxn', 'myr', 'nok', 'nzd', 'php', 'pkr', 'pln', 'rub', 'sek', 'sgd', 'thb', 'try', 'twd', 'usd', 'zar']

/**
 * Returns the price of coin in the symbol given
 * @param {string} coin - Coin name. NEO or GAS.
 * @param {string} currency - Three letter currency symbol.
 * @return {Promise<number>} price
 */
export const getPrice = (coin = 'NEO', currency = 'usd') => {
  currency = currency.toLowerCase()
  coin = coin.toLowerCase()
  if (CURRENCY.includes(currency)) {
    return axios.get(`https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${currency}`)
      .then((res) => {
        const data = res.data
        if (data.error) throw new Error(data.error)
        const price = data[0][`price_${currency.toLowerCase()}`]
        if (price) return parseFloat(price)
        else throw new Error(`Something went wrong with the CoinMarketCap API!`)
      })
  } else {
    return Promise.reject(new ReferenceError(`${currency} is not one of the accepted currencies!`))
  }
}
