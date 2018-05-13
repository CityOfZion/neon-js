import Coin from '../../../src/wallet/components/Coin'
import { Fixed8 } from '../../../src/utils'

describe('Coin', function () {
  it('default', () => {
    const expected = { index: 0, txid: '', value: new Fixed8(0) }

    const result = Coin()
    result.should.eql(expected)
  })

  it('CoinLike', () => {
    const coinLike = { index: 1, txid: 'abc', value: 1.2345 }

    const result = Coin(coinLike)
    result.index.should.equal(coinLike.index)
    result.txid.should.equal(coinLike.txid)
    result.value.toNumber().should.equal(coinLike.value)
  })
})
