import Neon from '../../src/index.js'

const client = Neon.create.rpcClient('TestNet')

describe('RPC methods', function () {
  this.timeout(15000)

  it('test block height', (done) => {
    client.getBlockCount().then((count) => {
      count.should.be.a('number')
      done()
    })
  })

  it('test storage', (done) => {
    client.getStorage(Neon.CONST.CONTRACTS.TEST_RPX, 'totalSupply').then((response) => {
      response.should.be.a('string')
      done()
    })
  })
})
