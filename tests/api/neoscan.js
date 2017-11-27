import * as neoscan from '../../src/api/neoscan'
import testKeys from '../testKeys.json'

describe('Neoscan', function () {
  this.timeout(15000)
  it('should get balance from address', () => {
    return neoscan.getBalance('TestNet', testKeys.a.address)
      .then((response) => {
        response.assets.NEO.balance.should.be.a('number')
        response.assets.GAS.balance.should.be.a('number')
        response.address.should.equal(testKeys.a.address)
      })
  })

  it('should get unspent transactions', () => {
    return neoscan.getBalance('TestNet', testKeys.a.address)
      .then((response) => {
        response.assets.NEO.unspent.should.be.an('array')
        response.assets.GAS.unspent.should.be.an('array')
        response.address.should.equal(testKeys.a.address)
      })
  })

  it('should get claimable gas', () => {
    return neoscan.getClaims('TestNet', testKeys.a.address)
      .then((response) => {
        response.claims.should.be.an('array')
        response.address.should.equal(testKeys.a.address)
      })
  })
})
