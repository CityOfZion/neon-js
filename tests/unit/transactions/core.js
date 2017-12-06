import { calculateInputs, serializeTransaction, deserializeTransaction, signTransaction, getTransactionHash } from '../../src/transactions/core'
import createData from './createData.json'
import data from './data.json'

describe('Core Transaction Methods', function () {
  describe('calculateInputs', function () {
    it('outputs correctly', () => {
      const intents = [{
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: 1,
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      }]
      const { inputs, change } = calculateInputs(createData.balance, intents, 0.1)
      inputs.length.should.be.least(2)
      change.length.should.be.least(1)
    })

    it('Errors when insufficient balance', () => {
      const intents = [{
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: 100,
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      }]
      const thrower = () => {
        calculateInputs(createData.balance, intents, 0.1)
      }
      thrower.should.throw()
    })

    it('returns empty inputs/change when given null intents', () => {
      const intents = []
      const { inputs, change } = calculateInputs(createData.balance, intents)
      inputs.should.eql([])
      change.should.eql([])
    })
  })

  it('serialize', () => {
    Object.keys(data).map((key) => {
      let tx = data[key]
      const hexstring = serializeTransaction(tx.deserialized)
      hexstring.should.equal(tx.serialized.stream)
    })
  })

  it('deserialize', () => {
    Object.keys(data).map((key) => {
      let tx = data[key]
      const transaction = deserializeTransaction(tx.serialized.stream)
      transaction.should.eql(tx.deserialized)
    })
  })

  it('signTransaction', () => {
    Object.keys(data).map((key) => {
      let tx = data[key]
      // Only perform test if privateKey is available for that tx
      if (tx.privateKey) {
        const unsignedTransaction = Object.assign({}, tx.deserialized, { scripts: [] })
        const signedTx = signTransaction(unsignedTransaction, tx.privateKey)
        signedTx.scripts.should.eql(tx.deserialized.scripts)
      }
    })
  })

  it('getTransactionHash', () => {
    Object.keys(data).map((key) => {
      let tx = data[key]
      const hash = getTransactionHash(tx.deserialized)
      hash.should.equal(tx.hash)
    })
  })
})
