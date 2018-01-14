import * as NEP5 from '../../../src/api/nep5'
import { DEFAULT_RPC, CONTRACTS, NEO_NETWORK } from '../../../src/consts'
import testKeys from '../../unit/testKeys.json'

describe('Integration: API NEP5', function () {
  this.timeout(20000)
  const log = setupLogs()
  const scriptHash = CONTRACTS.TEST_LWTF

  describe('getToken', function () {
    it('get info and balance', () => {
      return NEP5.getToken(DEFAULT_RPC.TEST, scriptHash, testKeys.c.address)
        .then(result => {
          result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
          result.name.should.equal('LOCALTOKEN')
          result.symbol.should.equal('LWTF')
          result.decimals.should.equal(8)
          result.totalSupply.should.least(1969000)
          result.balance.should.be.above(0)
        })
    })

    it('should parse 0 decimals correctly', () => {
      return NEP5.getToken(DEFAULT_RPC.TEST, CONTRACTS.TEST_RHTT4, testKeys.a.address)
        .then(result => {
          result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
          result.decimals.should.equal(0)
          result.totalSupply.should.equal(60000)
          result.balance.should.equal(2)
        })
    })
  })

  it('getTokenInfo', () => {
    return NEP5.getTokenInfo(DEFAULT_RPC.TEST, CONTRACTS.TEST_RHTT4)
      .then(({ name, symbol, decimals, totalSupply }) => {
        name.should.equal('Redeemable HashPuppy Testnet Token 4')
        symbol.should.equal('RHTT4')
        decimals.should.equal(0)
        totalSupply.should.equal(60000)
      })
  })
  it('getTokenBalance', () => {
    return NEP5.getTokenBalance(DEFAULT_RPC.TEST, CONTRACTS.TEST_RHTT4, testKeys.b.address)
      .then(result => {
        result.should.equal(2)
      })
  })

  it.skip('doTransferToken', () => {
    const transferAmount = 1
    const gasCost = 0
    return NEP5.doTransferToken(NEO_NETWORK.TEST, scriptHash, testKeys.c.wif, testKeys.b.address, transferAmount, gasCost)
      .then(({ result, txid }) => {
        result.should.equal(true)
        console.log(txid)
      })
  })
})
