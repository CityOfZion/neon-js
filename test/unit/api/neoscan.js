import * as neoscan from '../../../src/api/neoscan'
import { Balance, Claims } from '../../../src/wallet'
import testKeys from '../testKeys.json'
import mockData from './mockData.json'
import { Fixed8 } from '../../../src/utils'

describe('Neoscan', function () {
  let mock

  before(() => {
    mock = setupMock(mockData.neoscan)
  })

  after(() => {
    mock.restore()
  })

  it('getBalance returns Balance object', () => {
    return neoscan.getBalance('TestNet', testKeys.a.address).then(response => {
      ;(response instanceof Balance).should.equal(true)
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
    return neoscan.getClaims('TestNet', testKeys.a.address).then(response => {
      ;(response instanceof Claims).should.equal(true)
      response.net.should.equal('TestNet')
      response.address.should.equal(testKeys.a.address)
      response.claims.should.be.an('array')
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
        ;(response instanceof Fixed8).should.equal(true)
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
