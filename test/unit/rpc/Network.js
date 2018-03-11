import Network from '../../../src/rpc/Network'
import mockNetwork from './mockNetwork.json'

describe('Network', () => {
  describe('Constructor', function () {
    it('default', () => {
      const result = new Network()
      result.should.not.equal(null)
    })

    it('standard', () => {
      const result = new Network(mockNetwork)
      result.should.include.all.keys(['name', 'protocol', 'nodes', 'extra'])
    })
  })

  it('readFile', () => {
    const result = Network.readFile('./test/unit/rpc/mockNetwork.json')
    result.should.not.equal(null)
  })

  it('export', () => {
    const n = new Network(mockNetwork)
    const result = n.export()
    Object.keys(result).should.include.all.members(Object.keys(mockNetwork))
  })
})
