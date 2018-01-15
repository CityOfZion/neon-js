import * as comp from '../../../src/wallet/components'
import { Fixed8 } from '../../../src/utils'

describe('Wallet Components', function () {
  describe('AssetBalance', function () {
    it('default', () => {
      const expected = {
        balance: new Fixed8(0),
        unspent: [],
        spent: [],
        unconfirmed: []
      }
      const result = comp.AssetBalance()
      result.should.eql(expected)
    })

    it('AssetBalanceLike', () => {
      const assetBalanceLike = {
        balance: 20,
        unspent: [
          { index: 0, txid: 'abc', value: 7 },
          { index: 1, txid: 'def', value: 13 }
        ],
        spent: [
          { index: 2, txid: 'ghi', value: 1.24 }
        ]
      }

      const result = comp.AssetBalance(assetBalanceLike)
      result.balance.toNumber().should.equal(assetBalanceLike.balance)
      result.unconfirmed.should.eql([])
      for (var i = 0; i < assetBalanceLike.unspent.length; i++) {
        result.unspent[i].index.should.equal(assetBalanceLike.unspent[i].index)
        result.unspent[i].txid.should.equal(assetBalanceLike.unspent[i].txid)
        result.unspent[i].value.toNumber().should.equal(assetBalanceLike.unspent[i].value)
      }
      for (i = 0; i < assetBalanceLike.spent.length; i++) {
        result.spent[i].index.should.equal(assetBalanceLike.spent[i].index)
        result.spent[i].txid.should.equal(assetBalanceLike.spent[i].txid)
        result.spent[i].value.toNumber().should.equal(assetBalanceLike.spent[i].value)
      }
    })
  })

  describe('Coin', function () {
    it('default', () => {
      const expected = { index: 0, txid: '', value: new Fixed8(0) }

      const result = comp.Coin()
      result.should.eql(expected)
    })

    it('CoinLike', () => {
      const coinLike = { index: 1, txid: 'abc', value: 1.2345 }

      const result = comp.Coin(coinLike)
      result.index.should.equal(coinLike.index)
      result.txid.should.equal(coinLike.txid)
      result.value.toNumber().should.equal(coinLike.value)
    })
  })

  describe('ClaimItem', function () {
    it('default', () => {
      const expected = {
        claim: new Fixed8(0),
        txid: '',
        index: 0,
        value: 0,
        start: null,
        end: null
      }

      const result = comp.ClaimItem()
      result.should.eql(expected)
    })

    it('ClaimItemLike', () => {
      const claimItemLike = {
        claim: 123,
        txid: 'abc',
        index: 1,
        value: 1,
        start: 12345,
        end: 23456
      }

      const result = comp.ClaimItem(claimItemLike)

      result.claim.toNumber().should.equal(claimItemLike.claim)
      result.txid.should.equal(claimItemLike.txid)
      result.index.should.equal(claimItemLike.index)
      result.value.should.equal(claimItemLike.value)
      result.start.toNumber().should.equal(claimItemLike.start)
      result.end.toNumber().should.equal(claimItemLike.end)
    })
  })
})
