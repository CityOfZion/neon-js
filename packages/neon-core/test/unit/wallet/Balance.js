import Balance from '../../../src/wallet/Balance'
import testData from '../testData.json'
import { Transaction } from '../../../src/transactions'
import { Fixed8 } from '../../../src/utils'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('Balance', function () {
  let bal
  beforeEach('refresh balance', () => {
    bal = new Balance({ net: 'TestNet', address: testData.a.address })
    bal.addAsset('NEO', testData.a.balance.assets.NEO)
    bal.addAsset('GAS', testData.a.balance.assets.GAS)
  })

  describe('addAsset', function () {
    it('empty balance', () => {
      bal.addAsset('new1')
      bal.assetSymbols.length.should.equal(3)
      bal.assetSymbols[2].should.equal('NEW1')
    })

    it('filled balance', () => {
      const coin = {
        value: 1,
        assetId: 'abc',
        scriptHash: 'def'
      }
      bal.addAsset('new2', { balance: 1, unspent: [coin] })
      bal.assetSymbols.length.should.equal(3)
      bal.assetSymbols[2].should.equal('NEW2')
      bal.assets.NEW2.should.have.keys(['balance', 'spent', 'unspent', 'unconfirmed'])
      bal.assets.NEW2.balance.toNumber().should.equal(1)
    })
  })

  describe('applyTx', function () {
    const intents = [
      {
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: new Fixed8(200),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      },
      {
        assetId: 'c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
        value: new Fixed8(59),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      },
      {
        assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
        value: new Fixed8(400),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      },
      {
        assetId: '602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7',
        value: new Fixed8(20.96175487),
        scriptHash: 'cef0c0fdcfe7838eff6ff104f9cdec2922297537'
      }
    ]

    it('unconfirmed', () => {
      Transaction.createContractTx(bal, intents)
      bal.assets.GAS.spent.length.should.equal(1)
      bal.assets.GAS.unspent.length.should.equal(1)
      bal.assets.GAS.unconfirmed.length.should.equal(2)
      bal.assets.NEO.spent.length.should.equal(1)
      bal.assets.NEO.unspent.length.should.equal(0)
      bal.assets.NEO.unconfirmed.length.should.equal(2)
    })

    it('confirmed', () => {
      const tx = Transaction.createContractTx(bal, intents)
      bal.applyTx(tx, true)
      bal.assets.GAS.spent.length.should.equal(1)
      bal.assets.GAS.unspent.length.should.equal(3)
      if (bal.assets.GAS.unconfirmed) bal.assets.GAS.unconfirmed.length.should.equal(0)
      bal.assets.NEO.spent.length.should.equal(1)
      bal.assets.NEO.unspent.length.should.equal(2)
      if (bal.assets.NEO.unconfirmed) bal.assets.NEO.unconfirmed.length.should.equal(0)
    })
  })

  it('confirm', () => {
    bal.assets.NEO.unconfirmed = [{ txid: 'abc', index: 0, value: 1 }]
    const unspentLength = bal.assets.NEO.unspent.length
    bal.confirm()
    bal.assets.NEO.unspent.length.should.equal(unspentLength + 1)
  })

  describe('verifyAssets', function () {
    let mock
    before(() => {
      mock = new MockAdapter(axios)
      mock.onPost().reply(200, {
        'jsonrpc': '2.0',
        'id': 1234,
        'result': null
      })
    })
    after(() => mock.restore())

    it('all spent', () => {
      return bal.verifyAssets('http://seed1.neo.org:20332')
        .then((bal) => {
          bal.assets.GAS.spent.length.should.equal(2)
          bal.assets.NEO.spent.length.should.equal(1)
        })
    })
  })

  describe('export', function () {
    it('exports correctly', () => {
      const result = bal.export()
      result.assets.should.eql(testData.a.balance.assets)
    })
  })
})
