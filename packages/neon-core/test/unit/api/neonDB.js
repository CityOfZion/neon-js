import * as neonDB from '../../../src/api/neonDB'
import * as settings from '../../../src/settings'
import { Balance, Claims } from '../../../src/wallet'
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

  it('getAPIEndpoint', () => {
    neonDB.getAPIEndpoint('MainNet').should.equal(settings.networks['MainNet'].extra.neonDB)
    neonDB.getAPIEndpoint('TestNet').should.equal(settings.networks['TestNet'].extra.neonDB)
  })

  it('geRPCEndpoint returns https only', () => {
    settings.httpsOnly = true
    neonDB.getRPCEndpoint('TestNet')
      .then(res => res.should.have.string('https://'))
      .then(() => { settings.httpsOnly = false })
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
        response.map(tx => {
          tx.should.have.keys(['change', 'blockHeight', 'txid'])
        })
      })
  })

  it('should allow custom API endpoint, i.e. for private net', done => {
    const customEndpoint = 'http://localhost:5000'
    const privNet = neonDB.getAPIEndpoint(customEndpoint)
    privNet.should.equal(customEndpoint)
    done()
  })
})
