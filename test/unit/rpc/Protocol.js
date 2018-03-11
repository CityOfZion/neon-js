import Protocol from '../../../src/rpc/Protocol'
import mockProtocol from './mockProtocol.json'

describe('Protocol', () => {
  describe('Constructor', function () {
    it('default', () => {
      const result = new Protocol()
      result.should.not.equal(null)
    })

    it('standard', () => {
      const result = new Protocol(mockProtocol)
      result.should.include.all.keys(['magic', 'addressVersion', 'standbyValidators', 'seedList', 'systemFee'])
      result.magic.should.equal(1010102)
      result.addressVersion.should.equal(23)
      result.standbyValidators.length.should.equal(4)
      result.seedList.length.should.equal(4)
    })
  })

  describe('readFile', () => {
    const result = Protocol.readFile('./test/unit/rpc/mockProtocol.json')
    result.should.not.equal(null)
  })

  describe('export', () => {
    const p = new Protocol(mockProtocol)
    const result = p.export()
    result.should.eql(mockProtocol)
  })
})
