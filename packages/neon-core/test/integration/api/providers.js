import * as neoscan from '../../../src/api/neoscan'
import * as neonDB from '../../../src/api/neonDB'
import { Balance, Claims } from '../../../src/wallet'
import { Fixed8 } from '../../../src/utils'

describe('Integration: Providers', function () {
  this.timeout(20000)
  const addr = 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'
  const apis = [neoscan, neonDB]

  apis.map(api => {
    describe(api.name, function () {
      it('getBalance', () => {
        return api.getBalance('TestNet', addr)
          .then(res => {
            res.should.be.instanceof(Balance)
            res.should.have.keys(['assets', 'assetSymbols', 'tokens', 'tokenSymbols', 'address', 'net'])
          })
      })

      it('getClaims', () => {
        return api.getClaims('TestNet', addr)
          .then(res => {
            res.should.be.instanceof(Claims)
            res.should.have.keys(['net', 'address', 'claims'])
          })
      })

      it('getMaxClaimAmount', () => {
        return api.getMaxClaimAmount('TestNet', addr)
          .then(res => {
            res.should.be.instanceof(Fixed8)
          })
      })

      it('getRPCEndpoint', () => {
        return api.getRPCEndpoint('TestNet', addr)
          .then(res => {
            res.should.be.a('string')
          })
      })

      it('getTransactionHistory', () => {
        return api.getTransactionHistory('TestNet', addr)
          .then(res => {
            res.should.be.a('array')
            res.map(tx => {
              tx.should.have.keys(['change', 'blockHeight', 'txid'])
            })
          })
      })

      it('getWalletDBHeight', () => {
        return api.getWalletDBHeight('TestNet')
          .then(res => {
            res.should.be.a('number')
          })
      })
    })
  })
})
