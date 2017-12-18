import * as NEP5 from '../../../src/api/nep5'
import { DEFAULT_RPC, CONTRACTS } from '../../../src/consts'
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
  })

  it('doTransferToken', () => {
    const testNet = 'TestNet'
    const transferAmount = 1
    const gasCost = 0
    return NEP5.doTransferToken(testNet, scriptHash, testKeys.c.wif, testKeys.b.address, transferAmount, gasCost)
      .then(({ result, txid }) => {
        result.should.equal(true)
        console.log(txid)
      })
  })
})
