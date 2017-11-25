import * as NEP5 from '../../src/api/nep5'
import testKeys from '../testKeys.json'

describe('NEP5', function () {
  this.timeout(10000)
  const net = 'http://seed3.neo.org:20332'
  const scriptHash = 'd7678dd97c000be3f33e9362e673101bac4ca654'

  it('get basic info', () => {
    return NEP5.getTokenInfo(net, scriptHash)
      .then(result => {
        result.name.should.equal('LOCALTOKEN')
        result.symbol.should.equal('LWTF')
        result.decimals.should.equal(8)
        result.totalSupply.should.equal(1969000)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  it('get balance', () => {
    return NEP5.getTokenBalance(net, scriptHash, testKeys.c.address)
      .then(result => {
        result.should.be.above(0)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  it('transfers tokens', () => {
    const testNet = 'TestNet'
    const fromWif = 'L5FzBMGSG2d7HVJL5vWuXfxUKsrkX5irFhtw1L5zU4NAvNuXzd8a'
    const transferAmount = 1
    const gasCost = 0
    return NEP5.doTransferToken(testNet, scriptHash, fromWif, testKeys.c.address, transferAmount, gasCost)
      .then(({ result }) => {
        result.should.equal(true)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
})
