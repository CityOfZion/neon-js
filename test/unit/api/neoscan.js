import * as neoscan from '../../../src/api/neoscan'
import * as settings from '../../../src/settings'
import { Balance, Claims } from '../../../src/wallet'
import { Fixed8 } from '../../../src/utils'
import testKeys from '../testKeys.json'
import mockData from './mockData.json'

describe('Neoscan', function () {
  let mock

  before(() => {
    mock = setupMock(mockData.neoscan)
  })

  after(() => {
    mock.restore()
  })

  it('getAPIEndpoint', () => {
    neoscan.getAPIEndpoint('MainNet').should.equal(settings.networks['MainNet'].extra.neoscan)
    neoscan.getAPIEndpoint('TestNet').should.equal(settings.networks['TestNet'].extra.neoscan)
    neoscan.getAPIEndpoint('CozNet').should.equal(settings.networks['CozNet'].extra.neoscan)
  })

  it('geRPCEndpoint returns https only', () => {
    settings.httpsOnly = true
    neoscan.getRPCEndpoint('TestNet')
      .then(res => res.should.have.string('https://'))
      .then(() => { settings.httpsOnly = false })
  })

  it('getBalance returns Balance object', () => {
    return neoscan.getBalance('TestNet', testKeys.a.address).then(response => {
      response.should.be.an.instanceof(Balance)
      response.assetSymbols.should.have.members(['NEO', 'GAS'])
      response.assets.NEO.balance.toNumber().should.equal(261)
      response.assets.NEO.unspent.should.be.an('array')
      response.assets.GAS.balance.toNumber().should.equal(1117.93620487)
      response.assets.GAS.unspent.should.be.an('array')
      response.net.should.equal('TestNet')
      response.address.should.equal(testKeys.a.address)
    })
  })

  it('getBalance on invalid/empty address returns null Balance object', () => {
    return neoscan.getBalance('TestNet', 'invalidAddress').then(response => {
      response.should.be.an.instanceof(Balance)
      response.address.should.equal('not found')
    })
  })

  it('getClaims returns Claims object', () => {
    return neoscan.getClaims('TestNet', testKeys.a.address).then(response => {
      response.should.be.an.instanceof(Claims)
      response.net.should.equal('TestNet')
      response.address.should.equal(testKeys.a.address)
      response.claims.should.be.an('array')
    })
  })

  it('getClaims on invalid/empty address returns null Claims object', () => {
    return neoscan.getClaims('TestNet', 'invalidAddress').then(response => {
      response.should.be.an.instanceof(Claims)
      response.address.should.equal('not found')
    })
  })

  it('getWalletDBHeight returns height number', () => {
    return neoscan.getWalletDBHeight('TestNet').then(response => {
      response.should.equal(1049805)
    })
  })

  it('getTransactionHistory returns history', () => {
    return neoscan
      .getTransactionHistory('TestNet', testKeys.a.address)
      .then(response => {
        response.should.be.an('array')
      })
  })

  it('getMaxClaimAmount returns amount', () => {
    return neoscan
      .getMaxClaimAmount('TestNet', testKeys.a.address)
      .then(response => {
        ; (response instanceof Fixed8).should.equal(true)
        const testNum = new Fixed8(0.03455555)
        const responseNumber = response.toNumber()
        responseNumber.should.equal(testNum.toNumber())
      })
  })

  it('should allow custom API endpoint, i.e. for private net', done => {
    const customEndpoint = 'http://localhost:5000'
    const privNet = neoscan.getAPIEndpoint(customEndpoint)
    privNet.should.equal(customEndpoint)
    done()
  })
})
