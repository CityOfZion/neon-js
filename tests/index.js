import {
  hexstring2ab,
  ab2hexstring,
  base58
} from '../src/utils'
import * as Neon from '../src/index'
import testKeys from './testKeys.json'

describe('Wallet', function () {
  this.timeout(15000)

  // TODO: this works, but will not work repeatedly for obvious reasons :)
  it.skip('should claim GAS', () => {
    return Neon.doClaimAllGas('TestNet', testKeys.b.wif)
      .then((response) => {
        console.log('claim', response)
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should verify that script has produces the same address', (done) => {
    for (let i = 0; i < 100; i++) {
      const privateKey = ab2hexstring(Neon.generatePrivateKey())
      const account = Neon.getAccountFromPrivateKey(privateKey)
      const addressFromScript1 = Neon.toAddress(base58.decode(account.address).slice(1, 21))
      const addressFromScript2 = Neon.toAddress(hexstring2ab(Neon.getHash(Neon.createSignatureScript(account.publicKeyEncoded)).toString()))
      addressFromScript1.should.equal(account.address)
      addressFromScript2.should.equal(account.address)
    }
    done()
  })

  it('should get balance from address', () => {
    return Neon.getBalance('TestNet', testKeys.a.address)
      .then((response) => {
        response.NEO.balance.should.be.a('number')
        response.GAS.balance.should.be.a('number')
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should get unspent transactions', () => {
    return Neon.getBalance('TestNet', testKeys.a.address, Neon.ansId)
      .then((response) => {
        response.NEO.unspent.should.be.an('array')
        response.GAS.unspent.should.be.an('array')
      }).catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should send NEO', () => {
    return Neon.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'NEO': 1 })
      .then((response) => {
        response.result.should.equal(true)
        // send back so we can re-run
        return Neon.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'NEO': 1 })
      })
      .then((response) => {
        response.result.should.equal(true)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })

  it('should send GAS', () => {
    return Neon.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1 })
      .then((response) => {
        response.should.have.property('result', true)
        // send back so we can re-run
        return Neon.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1 })
      })
      .then((response) => {
        response.should.have.property('result', true)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
  // this test passes, but cannot be run immediately following previous tests given state changes
  it.skip('should send NEO and GAS', (done) => {
    return Neon.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1, 'NEO': 1 })
      .then((response) => {
        response.should.have.property('result', true)
        // send back so we can re-run
        return Neon.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1, 'NEO': 1 })
      })
      .then((response) => {
        response.should.have.property('result', true)
        done()
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  })
})
