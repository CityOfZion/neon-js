import Neon from '../../../src/index.js'

const client = Neon.create.rpcClient('TestNet')

describe('RPC methods', function () {
  this.timeout(15000)

  it('test block height', () => {
    return client.getBlockCount()
      .then((count) => {
        count.should.be.a('number')
      })
  })

  it('test storage', () => {
    return client.getStorage(Neon.CONST.CONTRACTS.TEST_RPX, '9847e26135152874355e324afd5cc99f002acb33')
      .then((response) => {
        response.should.be.a('string')
      })
  })
})
