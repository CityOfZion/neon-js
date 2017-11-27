import Balance from '../../src/wallet/Balance'
import testData from '../testData.json'

describe.only('Balance', function () {
  let bal
  beforeEach('refresh balance', () => {
    bal = new Balance({ net: 'TestNet', address: testData.a.address })
    bal.addAsset('NEO', testData.a.balance.NEO)
    bal.addAsset('GAS', testData.a.balance.GAS)
  })

  describe('addAsset', function () {
    it('empty balance', () => {
      bal.addAsset('new1')
      bal.assetSymbols.length.should.equal(3)
      bal.assetSymbols[2].should.equal('NEW1')
    })

    it('filled balance', () => {
      const coin = {
        value: 1,
        assetId: 'abc',
        scriptHash: 'def'
      }
      bal.addAsset('new2', { balance: 1, unspent: [coin] })
      bal.assetSymbols.length.should.equal(3)
      bal.assetSymbols[2].should.equal('NEW2')
      bal.assets.NEW2.should.have.keys(['balance', 'spent', 'unspent', 'unconfirmed'])
      bal.assets.NEW2.balance.should.equal(1)
    })
  })

  it('verifyAssets', () => {
    return bal.verifyAssets('http://seed1.neo.org:20332')
      .then((bal) => {
        bal.assets.GAS.spent.length.should.least(1)
        bal.assets.NEO.spent.length.should.least(1)
      })
  })
})
