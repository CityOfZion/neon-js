import * as NEP5 from '../../src/api/nep5'
import testKeys from '../testKeys.json'

describe('NEP5', function () {
  this.timeout(10000)
  const net = 'http://test1.cityofzion.io:8880'
  const rpxScriptHash = '5b7074e873973a6ed3708862f219a6fbf4d1c411'

  it('get basic info', () => {
    return NEP5.getTokenInfo(net, rpxScriptHash)
      .then(result => {
        result.name.should.equal('Red Pulse Token 3.1.4')
        result.symbol.should.equal('RPX')
        result.decimals.should.equal(8)
        result.totalSupply.should.be.above(1000)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  it('get balance', () => {
    return NEP5.getTokenBalance(net, rpxScriptHash, testKeys.c.address)
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
    const scriptHash = 'd7678dd97c000be3f33e9362e673101bac4ca654'
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
