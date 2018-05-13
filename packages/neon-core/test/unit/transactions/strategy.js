import { smallestFirst, biggestFirst, balancedApproach } from '../../../src/transactions/strategy'
import Coin from '../../../src/wallet/components/Coin'
import { Fixed8 } from '../../../src/utils'

describe('Strategy', function () {
  let coins
  let assetBalance

  beforeEach(() => {
    coins = [
      Coin({ txid: '1', value: 1 }),
      Coin({ txid: '2', value: 2 }),
      Coin({ txid: '3', value: 3 }),
      Coin({ txid: '4', value: 4 }),
      Coin({ txid: '5', value: 5 }),
      Coin({ txid: '6', value: 6 }),
      Coin({ txid: '7', value: 7 })
    ]
    assetBalance = {
      unspent: coins.slice(0)
    }
  })

  it('smallestFirst', () => {
    const result = smallestFirst(assetBalance, new Fixed8(4))
    result.should.have.members([coins[0], coins[1], coins[2]])
  })

  it('biggestFirst', () => {
    const result = biggestFirst(assetBalance, new Fixed8(4))
    result.should.have.members([coins[6]])
  })

  describe('balancedApproach', function () {
    it('tiny requiredAmt', () => {
      const result = balancedApproach(assetBalance, new Fixed8(0.1))
      result.should.have.members([coins[0]])
    })
    it('exact', () => {
      const result = balancedApproach(assetBalance, new Fixed8(4))
      result.should.have.members([coins[3]])
    })

    it('with change', () => {
      const result = balancedApproach(assetBalance, new Fixed8(4.1))
      result.should.have.members([coins[0], coins[3]])
    })

    it('big amt', () => {
      const result = balancedApproach(assetBalance, new Fixed8(20))
      result.should.have.members([coins[6], coins[0], coins[1], coins[2], coins[3], coins[4]])
    })

    it('all', () => {
      const result = balancedApproach(assetBalance, new Fixed8(28))
      result.should.have.members([coins[0], coins[1], coins[2], coins[3], coins[4], coins[5], coins[6]])
    })
  })
})
