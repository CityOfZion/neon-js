import * as CMC from '../../src/api/coinmarketcap'

describe('coinmarketcap', function () {
  it('get price of GAS in usd', () => {
    return CMC.getPrice('GAS').should.eventually.be.a('number')
  })

  it('get price of NEO in sgd', () => {
    return CMC.getPrice('NEO', 'SGD').should.eventually.be.a('number')
  })

  it('rejects Promise when given unknown currency', () => {
    return CMC.getPrice('NEO', 'wtf').should.eventually.be.rejected
  })

  it('rejects Promise when given unknown coin', () => {
    return CMC.getPrice('NEON').should.eventually.be.rejected
  })
})
