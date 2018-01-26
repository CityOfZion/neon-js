import * as neonDB from '../../../src/api/neonDB'
import {Balance, Claims} from '../../../src/wallet'
import testKeys from '../testKeys.json'
import mockData from './mockData.json'

describe('NeonDB', function () {
  let mock

  before(() => {
    mock = setupMock(mockData.neonDB)
  })

  after(() => {
    mock.restore()
  })

  it('getBalance returns Balance object', () => {
    return neonDB.getBalance('TestNet', testKeys.a.address)
      .then((response) => {
        (response instanceof Balance).should.equal(true)
        response.assetSymbols.should.have.members(['NEO', 'GAS'])
        response.assets.NEO.balance.toNumber().should.equal(261)
        response.assets.NEO.unspent.should.be.an('array')
        response.assets.GAS.balance.toNumber().should.equal(1117.93620487)
        response.assets.GAS.unspent.should.be.an('array')
        response.net.should.equal('TestNet')
        response.address.should.equal(testKeys.a.address)
      })
  })

  it('getClaims returns Claims object', () => {
    return neonDB.getClaims('TestNet', testKeys.a.address)
      .then((response) => {
        (response instanceof Claims).should.equal(true)
        response.net.should.equal('TestNet')
        response.address.should.equal(testKeys.a.address)
        response.claims.should.be.an('array')
      })
  })

  it('getWalletDBHeight returns height number', () => {
    return neonDB.getWalletDBHeight('TestNet')
      .then((response) => {
        response.should.equal(850226)
      })
  })

  it('getTransactionHistory returns history', () => {
    return neonDB.getTransactionHistory('TestNet', testKeys.a.address)
      .then((response) => {
        response.should.be.an('array')
      })
  })

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

  it.skip('should send NEO', () => {
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

  it.skip('should send GAS', () => {
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
