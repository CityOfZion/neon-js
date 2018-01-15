import * as CMC from '../../../src/api/coinmarketcap'
import mockData from './mockData.json'

describe('coinmarketcap', function () {
  let mock

  before(() => {
    mock = setupMock(mockData.cmc)
  })

  after(() => {
    mock.restore()
  })

  describe('getPrice', function () {
    it('gets price of GAS in USD', () => {
      return CMC.getPrice('GAS').should.eventually.be.a('number')
    })

    it('gets price of NEO in SGD', () => {
      return CMC.getPrice('NEO', 'SGD').should.eventually.be.a('number')
    })

    it('rejects Promise when given unknown currency', () => {
      return CMC.getPrice('NEO', 'wtf').should.eventually.be.rejectedWith(Error, 'wtf is not one of the accepted currencies!')
    })

    it('rejects Promise when given unknown coin', () => {
      return CMC.getPrice('NEON').should.eventually.be.rejectedWith(Error, 'id not found')
    })
  })

  describe('getPrices', function () {
    it('gets prices of NEO & GAS in USD', () => {
      return CMC.getPrices(['NEO', 'GAS']).should.eventually.deep.equal({
        NEO: 66.5875,
        GAS: 28.7096
      })
    })

    it('gets prices of NEO & GAS in SGD', () => {
      return CMC.getPrices(['NEO', 'GAS'], 'SGD').should.eventually.deep.equal({
        NEO: 89.2645815294,
        GAS: 38.3191052616
      })
    })

    it('rejects Promise when given unknown currency', () => {
      return CMC.getPrices(['NEO', 'GAS'], 'wtf').should.eventually.be.rejectedWith(Error, 'wtf is not one of the accepted currencies!')
    })

    it('rejects Promise when given unknown coin', () => {
      return CMC.getPrices(['NEON']).should.eventually.be.rejectedWith(Error, 'None of the coin symbols are supported by CoinMarketCap!')
    })
  })
})
