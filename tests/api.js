import Neon from '../src'
import testKeys from './testKeys.json'

describe('NeonDB', function () {
  this.timeout(15000)

  // TODO: this works, but will not work repeatedly for obvious reasons :)
  it.skip('should claim GAS', () => {
    return Neon.api.doClaimAllGas('TestNet', testKeys.b.wif)
      .then((response) => {
        console.log('claim', response)
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should get balance from address', () => {
    return Neon.api.getBalance('TestNet', testKeys.a.address)
      .then((response) => {
        response.NEO.balance.should.be.a('number')
        response.GAS.balance.should.be.a('number')
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should get unspent transactions', () => {
    return Neon.api.getBalance('TestNet', testKeys.a.address, Neon.ansId)
      .then((response) => {
        response.NEO.unspent.should.be.an('array')
        response.GAS.unspent.should.be.an('array')
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should send NEO', () => {
    return Neon.api.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'NEO': 1 })
      .then((response) => {
        response.result.should.equal(true)
        // send back so we can re-run
        return Neon.api.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'NEO': 1 })
      })
      .then((response) => {
        response.result.should.equal(true)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should send GAS', () => {
    return Neon.api.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1 })
      .then((response) => {
        response.should.have.property('result', true)
        // send back so we can re-run
        return Neon.api.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1 })
      })
      .then((response) => {
        response.should.have.property('result', true)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  // this test passes, but cannot be run immediately following previous tests given state changes
  it.skip('should send NEO and GAS', (done) => {
    return Neon.api.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1, 'NEO': 1 })
      .then((response) => {
        response.should.have.property('result', true)
        // send back so we can re-run
        return Neon.api.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1, 'NEO': 1 })
      })
      .then((response) => {
        response.should.have.property('result', true)
        done()
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
})

describe('coinmarketcap', function () {
  it('get price of GAS in usd', () => {
    return Neon.api.getPrice('GAS').should.eventually.be.a('number')
  })

  it('get price of NEO in sgd', () => {
    return Neon.api.getPrice('NEO', 'SGD').should.eventually.be.a('number')
  })

  it('rejects Promise when given unknown currency', () => {
    return Neon.api.getPrice('NEO', 'wtf').should.eventually.be.rejected
  })

  it('rejects Promise when given unknown coin', () => {
    return Neon.api.getPrice('NEON').should.eventually.be.rejected
  })
})
