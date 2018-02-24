import * as neonDB from '../../../src/api/neonDB'
import { CONTRACTS, NEO_NETWORK } from '../../../src/consts'
import testKeys from '../../unit/testKeys.json'

describe('Integration: API neonDB', function () {
  this.timeout(20000)

  it('select best node', () => {
    return neonDB.getRPCEndpoint('MainNet')
      .then(res => {
        res.should.not.be.null;
      })
  })
})
