import * as neonDB from '../../../src/api/neonDB'
import { CONTRACTS, NEO_NETWORK } from '../../../src/consts'
import testKeys from '../../unit/testKeys.json'

describe.skip('Integration: API neonDB', function () {
  this.timeout(20000)
  it('should mint tokens', () => {
    const neo = 1
    const gasCost = 0
    const signingFunction = null
    return neonDB.doMintTokens(NEO_NETWORK.TEST, CONTRACTS.TEST_NXT, testKeys.a.wif, neo, gasCost, signingFunction)
      .then((response) => {
        response.should.have.property('result', true)
      })
  })
})
