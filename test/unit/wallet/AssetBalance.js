import AssetBalance from '../../../src/wallet/components/AssetBalance'
import { Fixed8 } from '../../../src/utils'

describe('AssetBalance', function () {
  it('default', () => {
    const expected = {
      balance: new Fixed8(0),
      unspent: [],
      spent: [],
      unconfirmed: []
    }
    const result = AssetBalance()
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

    const result = AssetBalance(assetBalanceLike)
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
