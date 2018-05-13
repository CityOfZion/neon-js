import * as switchMethods from '../../../src/api/switch'
import * as core from '../../../src/api/core'
import { Balance, Claims } from '../../../src/wallet'
import { Fixed8 } from '../../../src/utils'
import testKeys from '../testKeys.json'
import mockData from './mockData.json'

describe('Switch API', function () {
  let mock
  const baseConfig = {
    net: 'TestNet'
  }
  const addressConfig = Object.assign({}, baseConfig, {
    address: testKeys.a.address
  })
  const checkProperty = (obj, ...props) => {
    for (const prop of props) {
      if (!obj.hasOwnProperty(prop)) {
        return false
      }
    }
    return true
  }

  before(() => {
    mock = setupMock([mockData.neonDB, mockData.neoscan])
  })

  after(() => {
    mock.restore()
  })

  describe('neoscan', () => {
    before(() => {
      switchMethods.setApiSwitch(0)
    })

    it('calls getWalletDBHeight', async () => {
      const response = await switchMethods.loadBalance(
        core.getWalletDBHeightFrom,
        baseConfig
      )
      return response.should.equal(1049805)
    })

    it('calls getRPCEndpoint', async () => {
      const response = await switchMethods.loadBalance(
        core.getRPCEndpointFrom,
        baseConfig
      )
      return response.should.equal('http://test5.cityofzion.io:8880')
    })

    it('calls getMaxClaimAmount', async () => {
      const response = await switchMethods.loadBalance(
        core.getMaxClaimAmountFrom,
        addressConfig
      )
      ;(response instanceof Fixed8).should.equal(true)
      const testNum = new Fixed8(0.03455555)
      const responseNumber = response.toNumber()
      responseNumber.should.equal(testNum.toNumber())
    })

    it('calls getTransactionHistory', async () => {
      const response = await switchMethods.loadBalance(
        core.getTransactionHistoryFrom,
        addressConfig
      )
      historyResponseCheck(response[0])
      console.log(response[0])
      return response[0].change.NEO.toNumber().should.equal(0)
    })

    it('calls getClaimsFrom', async () => {
      const response = await switchMethods.loadBalance(
        core.getClaimsFrom,
        addressConfig
      )
      claimsResponseCheck(response.claims.claims[0])
      ;(response.claims instanceof Claims).should.equal(true)
      response.net.should.equal('TestNet')
      response.address.should.equal(testKeys.a.address)
      return response.claims.claims.should.be.an('array')
    })

    it('calls getBalanceFrom', async () => {
      const response = await switchMethods.loadBalance(
        core.getBalanceFrom,
        addressConfig
      )
      const { balance } = response
      balanceResponseCheck(balance)
      ;(balance instanceof Balance).should.equal(true)
      balance.assetSymbols.should.have.members(['NEO', 'GAS'])
      balance.assets.NEO.balance.toNumber().should.equal(261)
      balance.assets.NEO.unspent.should.be.an('array')
      balance.assets.GAS.balance.toNumber().should.equal(1117.93620487)
      balance.assets.GAS.unspent.should.be.an('array')
      balance.net.should.equal('TestNet')
      return balance.address.should.equal(testKeys.a.address)
    })
  })

  describe('neonDB', () => {
    before(() => {
      switchMethods.setApiSwitch(1)
    })

    it('calls getWalletDBHeight', async () => {
      const response = await switchMethods.loadBalance(
        core.getWalletDBHeightFrom,
        baseConfig
      )
      return response.should.equal(850226)
    })

    it('calls getRPCEndpoint', async () => {
      const response = await switchMethods.loadBalance(
        core.getRPCEndpointFrom,
        baseConfig
      )
      return response.should.equal('http://seed8.antshares.org:20332')
    })

    it('calls getMaxClaimAmount', async () => {
      const response = await switchMethods.loadBalance(
        core.getMaxClaimAmountFrom,
        addressConfig
      )
      ;(response instanceof Fixed8).should.equal(true)
      const testNum = new Fixed8(45672365 + 112135434).div(100000000)
      const responseNumber = response.toNumber()
      responseNumber.should.equal(testNum.toNumber())
    })

    it('calls getTransactionHistory', async () => {
      const response = await switchMethods.loadBalance(
        core.getTransactionHistoryFrom,
        addressConfig
      )
      historyResponseCheck(response[0])
      return response[0].change.NEO.toNumber().should.equal(1)
    })

    it('calls getClaimsFrom', async () => {
      const response = await switchMethods.loadBalance(
        core.getClaimsFrom,
        addressConfig
      )
      claimsResponseCheck(response.claims.claims[0])
      ;(response.claims instanceof Claims).should.equal(true)
      response.net.should.equal('TestNet')
      response.address.should.equal(testKeys.a.address)
      return response.claims.claims.should.be.an('array')
    })

    it('calls getBalanceFrom', async () => {
      const response = await switchMethods.loadBalance(
        core.getBalanceFrom,
        addressConfig
      )
      const { balance } = response
      balanceResponseCheck(balance)
      ;(balance instanceof Balance).should.equal(true)
      balance.assetSymbols.should.have.members(['NEO', 'GAS'])
      balance.assets.NEO.balance.toNumber().should.equal(261)
      balance.assets.NEO.unspent.should.be.an('array')
      balance.assets.GAS.balance.toNumber().should.equal(1117.93620487)
      balance.assets.GAS.unspent.should.be.an('array')
      balance.net.should.equal('TestNet')
      return balance.address.should.equal(testKeys.a.address)
    })
  })

  const historyResponseCheck = obj =>
    checkProperty(
      obj,
      'change',
      'blockHeight',
      'txid'
    ).should.equal(true)

  const claimsResponseCheck = obj =>
    checkProperty(obj, 'claim', 'txid', 'value', 'start', 'end').should.equal(
      true
    )

  const balanceResponseCheck = obj => {
    checkProperty(
      obj,
      'address',
      'net',
      'assetSymbols',
      'assets',
      'tokenSymbols',
      'tokens'
    ).should.equal(true)
    checkProperty(obj.assets, 'NEO', 'GAS').should.equal(true)
    return checkProperty(
      obj.assets.GAS,
      'balance',
      'spent',
      'unspent',
      'unconfirmed'
    ).should.equal(true)
  }
})
