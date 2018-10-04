const Neon = require('../packages/neon-js/dist/index')
const testKeys = require('../packages/neon-core/__tests__/testKeys.json')

const url = 'http://test1.cityofzion.io:8880'
console.log(Neon.nep5)
const printTokenBalances = function (scriptHash) {
  return Neon.nep5.getToken(url, scriptHash)
    .then(({ symbol }) => {
      console.log(`=== ${symbol} ===`)
    })
    .then(() => {
      const balances = Object.keys(testKeys).map((key) => {
        const addr = testKeys[key].address
        return Neon.nep5.getToken(url, scriptHash, addr)
          .then((res) => console.log(`${key}: ${res.balance}`))
      })
      return Promise.all(balances)
    })
}

printTokenBalances(Neon.CONST.CONTRACTS.TEST_LWTF)
  .then(() => printTokenBalances(Neon.CONST.CONTRACTS.TEST_RPX))
  .then(() => printTokenBalances('ae36e5a84ee861200676627df409b0f6eec44bd7'))
