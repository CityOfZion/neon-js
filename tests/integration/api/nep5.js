import * as NEP5 from '../../../src/api/nep5'
import { DEFAULT_RPC, CONTRACTS, NEO_NETWORK } from '../../../src/consts'
import testKeys from '../../unit/testKeys.json'

describe('Integration: API NEP5', function () {
  this.timeout(20000)
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
      return NEP5.getToken(DEFAULT_RPC.TEST, '400cbed5b41014788d939eaf6286e336e7140f8c')
      .then(result => {
        result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
        result.decimals.should.equal(0)
      })
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
