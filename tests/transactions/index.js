import chai from 'chai'
import { serializeTransaction, deserializeTransaction } from '../../src/transactions/index.js'
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
const should = chai.should()

import data from './data.json'

describe('Transactions', function () {
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
})