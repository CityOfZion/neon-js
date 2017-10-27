import Neon from '../../src'
import testKeys from '../testKeys.json'

describe('NeonDB', function () {
  this.timeout(15000)

  // TODO: this works, but will not work repeatedly for obvious reasons :)
  it.skip('should claim GAS', () => {
    return Neon.do.claimAllGas('TestNet', testKeys.b.wif)
      .then((response) => {
        console.log('claim', response)
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should get balance from address', () => {
    return Neon.get.balance('TestNet', testKeys.a.address)
      .then((response) => {
        response.NEO.balance.should.be.a('number')
        response.GAS.balance.should.be.a('number')
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should get unspent transactions', () => {
    return Neon.get.balance('TestNet', testKeys.a.address, Neon.ansId)
      .then((response) => {
        response.NEO.unspent.should.be.an('array')
        response.GAS.unspent.should.be.an('array')
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should send NEO', () => {
    return Neon.do.sendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'NEO': 1 })
      .then((response) => {
        response.result.should.equal(true)
        response.txid.should.be.a('string')
        // send back so we can re-run
        return Neon.do.sendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'NEO': 1 })
      })
      .then((response) => {
        response.result.should.equal(true)
        response.txid.should.be.a('string')
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should send GAS', () => {
    return Neon.do.sendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1 })
      .then((response) => {
        response.should.have.property('result', true)
        response.txid.should.be.a('string')
        // send back so we can re-run
        return Neon.do.sendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1 })
      })
      .then((response) => {
        response.should.have.property('result', true)
        response.txid.should.be.a('string')
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  // this test passes, but cannot be run immediately following previous tests given state changes
  it.skip('should send NEO and GAS', (done) => {
    return Neon.do.soSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1, 'NEO': 1 })
      .then((response) => {
        response.should.have.property('result', true)
        response.txid.should.be.a('string')
        // send back so we can re-run
        return Neon.do.soSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1, 'NEO': 1 })
      })
      .then((response) => {
        response.should.have.property('result', true)
        response.txid.should.be.a('string')
        done()
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
})
