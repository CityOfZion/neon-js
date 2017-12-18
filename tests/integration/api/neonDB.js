import * as neonDB from '../../../src/api/neonDB'
import { CONTRACTS, NEO_NETWORK } from '../../../src/consts'
import testKeys from '../../unit/testKeys.json'

describe('Integration: API neonDB', function () {
  it.skip('should mint tokens', done => {
    const neo = 1
    const gasCost = 0
    const signingFunction = null
    return neonDB.doMintTokens(NEO_NETWORK.TEST, CONTRACTS.TEST_LWTF, testKeys.a.wif, neo, gasCost, signingFunction)
      .then((response) => {
        response.should.have.property('result', true)
        done()
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
})
