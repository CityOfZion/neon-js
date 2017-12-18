import * as NEP5 from '../../../src/api/nep5'
import { DEFAULT_RPC, CONTRACTS, NEO_NETWORK } from '../../../src/consts'
import testKeys from '../../unit/testKeys.json'

describe.only('Integration: API NEP5', function () {
  it('get info and balance', () => {
    return NEP5.getToken(DEFAULT_RPC.TEST, CONTRACTS.TEST_LWTF, testKeys.c.address)
      .then(result => {
        console.log('token balance', result.balance);
        result.should.have.keys(['name', 'symbol', 'decimals', 'totalSupply', 'balance'])
        result.name.should.equal('LOCALTOKEN')
        result.symbol.should.equal('LWTF')
        result.decimals.should.equal(8)
        result.totalSupply.should.least(1969000)
        result.balance.should.be.above(0)
      })
  })

  it.skip('transfers tokens using neonDB', () => {
    const transferAmount = 1
    const gasCost = 0
    return NEP5.doTransferToken(NEO_NETWORK.TEST, CONTRACTS.TEST_LWTF, testKeys.c.wif, testKeys.a.address, transferAmount, gasCost)
      .then(({ result }) => {
        result.should.equal(true)
      })
  })
})
