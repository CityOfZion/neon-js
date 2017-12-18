const Neon = require('../lib/index.js')
const testKeys = require('../tests/unit/testKeys.json')

const url = Neon.CONST.DEFAULT_RPC.TEST

const printTokenBalances = function (scriptHash) {
  return Neon.api.nep5.getTokenInfo(url, scriptHash)
    .then(({ symbol }) => {
      console.log(`=== ${symbol} ===`)
    })
    .then(() => {
      const balances = Object.keys(testKeys).map((key) => {
        const addr = testKeys[key].address
        return Neon.api.nep5.getToken(url, scriptHash, addr)
          .then((res) => console.log(`${key}: ${res.balance}`))
      })
      return Promise.all(balances)
    })
}

printTokenBalances(Neon.CONST.CONTRACTS.TEST_LWTF)
  .then(() => printTokenBalances(Neon.CONST.CONTRACTS.TEST_RPX))
