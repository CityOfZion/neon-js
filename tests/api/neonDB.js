import * as neonDB from '../../src/api/NeonDB'
import testKeys from '../testKeys.json'

describe('NeonDB', function () {
  this.timeout(15000)

  // TODO: this works, but will not work repeatedly for obvious reasons :)
  it.skip('should claim GAS', () => {
    return neonDB.doClaimAllGas('TestNet', testKeys.b.wif)
      .then((response) => {
        console.log('claim', response)
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should get balance from address', () => {
    return neonDB.getBalance('TestNet', testKeys.a.address)
      .then((response) => {
        response.NEO.balance.should.be.a('number')
        response.GAS.balance.should.be.a('number')
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should get unspent transactions', () => {
    return neonDB.getBalance('TestNet', testKeys.a.address)
      .then((response) => {
        response.NEO.unspent.should.be.an('array')
        response.GAS.unspent.should.be.an('array')
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should send NEO', () => {
    return neonDB.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'NEO': 1 })
      .then((response) => {
        response.result.should.equal(true)
        response.txid.should.be.a('string')
        // send back so we can re-run
        return neonDB.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'NEO': 1 })
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
    return neonDB.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1 })
      .then((response) => {
        response.should.have.property('result', true)
        response.txid.should.be.a('string')
        // send back so we can re-run
        return neonDB.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1 })
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
    return neonDB.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1, 'NEO': 1 })
      .then((response) => {
        response.should.have.property('result', true)
        response.txid.should.be.a('string')
        // send back so we can re-run
        return neonDB.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1, 'NEO': 1 })
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

  it('should allow custom API endpoint, i.e. for private net', done => {
    const customEndpoint = 'http://localhost:5000'
    const privNet = neonDB.getAPIEndpoint(customEndpoint)
    privNet.should.equal(customEndpoint)
    done()
  })
})
