import * as neonDB from '../../../src/api/neonDB'

describe('Integration: API neonDB', function () {
  this.timeout(20000)

  it('select best node', () => {
    return neonDB.getRPCEndpoint('MainNet')
      .then(res => {
        res.should.be.a('string')
      })
  })
})
