import * as CMC from '../../src/api/coinmarketcap'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import mockData from './mockData.json'

describe('coinmarketcap', function () {
  let mock

  before(() => {
    mock = new MockAdapter(axios)
    mock
    .onGet(mockData.cmc.gas2usd.url).reply(200, mockData.cmc.gas2usd.response)
    .onGet(mockData.cmc.neo2sgd.url).reply(200, mockData.cmc.neo2sgd.response)
    .onGet().reply(200, mockData.cmc.error)
  })

  after(() => {
    mock.restore()
  })

  it('get price of GAS in usd', () => {
    return CMC.getPrice('GAS').should.eventually.be.a('number')
  })

  it('get price of NEO in sgd', () => {
    return CMC.getPrice('NEO', 'SGD').should.eventually.be.a('number')
  })

  it('rejects Promise when given unknown currency', () => {
    return CMC.getPrice('NEO', 'wtf').should.eventually.be.rejectedWith(Error, 'wtf is not one of the accepted currencies!')
  })

  it('rejects Promise when given unknown coin', () => {
    return CMC.getPrice('NEON').should.eventually.be.rejectedWith(Error, `id not found`)
  })
})
