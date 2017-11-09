import Tx from '../../src/transactions/transaction'
import data from './data.json'

describe('Transaction', function () {
  it('Constructor', () => {
    const tx = new Tx({
      type: 2,
      version: 2,
      attributes: [],
      shouldNotBeThere: false
    })
    tx.type.should.equal(2)
    tx.version.should.equal(2)
    tx.attributes.length.should.equal(0)
    tx.should.have.property('claims')
    tx.should.not.have.property('shouldNotBeThere')
  })

  it('get exclusive data', () => {
    const tx = new Tx(data[3].deserialized)
    tx.exclusiveData.should.have.property('claims')
  })

  it('get hash of tx', () => {
    Object.keys(data).map((k) => {
      const tx = new Tx(data[k].deserialized)
      tx.hash.should.equal(data[k].hash)
    })
  })

  it('serialize', () => {
    Object.keys(data).map((k) => {
      const tx = new Tx(data[k].deserialized)
      tx.serialize().should.equal(data[k].serialized.stream)
    })
  })

  it('deserialize', () => {
    Object.keys(data).map((k) => {
      const tx = Tx.deserialize(data[k].serialized.stream)
      tx.should.eql(data[k].deserialized)
    })
  })
})
