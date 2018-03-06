import { ClaimItem } from '../../../src/wallet/components/ClaimItem'
import { Fixed8 } from '../../../src/utils'

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

    const result = ClaimItem()
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

    const result = ClaimItem(claimItemLike)

    result.claim.toNumber().should.equal(claimItemLike.claim)
    result.txid.should.equal(claimItemLike.txid)
    result.index.should.equal(claimItemLike.index)
    result.value.should.equal(claimItemLike.value)
    result.start.toNumber().should.equal(claimItemLike.start)
    result.end.toNumber().should.equal(claimItemLike.end)
  })
})
