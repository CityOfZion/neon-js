import Neon from '../../src'

describe('coinmarketcap', function () {
  it('get price of GAS in usd', () => {
    return Neon.get.price('GAS').should.eventually.be.a('number')
  })

  it('get price of NEO in sgd', () => {
    return Neon.get.price('NEO', 'SGD').should.eventually.be.a('number')
  })

  it('rejects Promise when given unknown currency', () => {
    return Neon.get.price('NEO', 'wtf').should.eventually.be.rejected
  })

  it('rejects Promise when given unknown coin', () => {
    return Neon.get.price('NEON').should.eventually.be.rejected
  })
})
