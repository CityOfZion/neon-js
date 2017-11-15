import * as neoscan from '../../src/api/neoscan'
// import testKeys from '../testKeys.json'

describe.only('Neoscan', function () {
  this.timeout(15000)
  const mainAddr = 'ATsmYxUsJaU1AcZm3RCcTAhrvYUNMPaCvq'
  it('should get balance from address', () => {
    return neoscan.getBalance('MainNet', mainAddr)
      .then((response) => {
        response.NEO.balance.should.be.a('number')
        response.GAS.balance.should.be.a('number')
        response.address.should.equal(mainAddr)
      })
  })

  it('should get unspent transactions', () => {
    return neoscan.getBalance('MainNet', mainAddr)
      .then((response) => {
        response.NEO.unspent.should.be.an('array')
        response.GAS.unspent.should.be.an('array')
        response.address.should.equal(mainAddr)
      })
  })

  it('should get claimable gas', () => {
    return neoscan.getClaimAmounts('MainNet', mainAddr)
      .then((response) => {
        response.claims.should.be.an('array')
        response.address.should.equal(mainAddr)
      })
  })
})
