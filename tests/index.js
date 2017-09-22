import chai from 'chai'
import {
  hexstring2ab,
  ab2hexstring
} from '../src/utils'
import * as Neon from '../src/index'

var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
chai.should()

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var base58 = require('base-x')(BASE58)

describe('Wallet', function () {
  this.timeout(15000)

  const testKeys = {
    a: {
      address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
      wif: 'L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g',
      passphrase: 'city of zion',
      encryptedWif: '6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF'
    },
    b: {
      address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',
      wif: 'L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG'
    },
    c: {
      address: 'AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx',
      wif: 'KyKvWLZsNwBJx5j9nurHYRwhYfdQUu9tTEDsLCUHDbYBL8cHxMiG'
    }
  }

  const testNet = Neon.getAPIEndpoint('TestNet')

  // TODO: this works, but will not work repeatedly for obvious reasons :)
  it.skip('should claim ANC', (done) => {
    Neon.claimAllGAS(Neon.MAINNET, testKeys.c.wif).then((response) => {
      console.log(response)
      done()
    })
  })

  it('should generate a new private key', (done) => {
    const privateKey = ab2hexstring(Neon.generatePrivateKey())
    privateKey.should.have.length(64)
    done()
  })

  it('should generate a valid WIF', () => {
    const privateKey = Neon.generatePrivateKey()
    const wif = Neon.getWIFFromPrivateKey(privateKey)
    const account = Neon.getAccountFromWIFKey(wif)
    account.privateKey.should.equal(ab2hexstring(privateKey))
  })

  it('should encrypt a WIF using nep2', (done) => {
    Neon.encryptWIF(testKeys.a.wif, testKeys.a.passphrase).then((result) => {
      result.should.equal(testKeys.a.encryptedWif)
      done()
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

  it('should show that Neo address passes validation', (done) => {
    Neon.verifyAddress(testKeys.a.address).should.equal(true)
    done()
  })

  it('should show that btc address fails validation', (done) => {
    Neon.verifyAddress('1BoatSLRHtKNngkdXEeobR76b53LETtpyT').should.equal(false)
    done()
  })

  it('should decrypt a WIF using nep2', (done) => {
    Neon.decryptWIF(testKeys.a.encryptedWif, testKeys.a.passphrase).then((result) => {
      result.should.equal(testKeys.a.wif)
      done()
    })
  })

  it('should get keys from a WIF', (done) => {
    const account = Neon.getAccountFromWIFKey(testKeys.a.wif)
    account.privateKey.should.be.a('string')
    account.address.should.equal(testKeys.a.address)
    done()
  })

  it('should verify publicKeyEncoded', (done) => {
    const privateKey = ab2hexstring(Neon.generatePrivateKey())
    const account = Neon.getAccountFromPrivateKey(privateKey)
    account.should.not.equal(-1)
    const verify = Neon.verifyPublicKeyEncoded(account.publicKeyEncoded)
    verify.should.equal(true)
    done()
  })

  it('should verify address', (done) => {
    const privateKey = ab2hexstring(Neon.generatePrivateKey())
    const account = Neon.getAccountFromPrivateKey(privateKey)
    account.should.not.equal(-1)
    const verify = Neon.verifyAddress(account.address)
    verify.should.equal(true)
    done()
  })

  it('should get balance from address', (done) => {
    Neon.getBalance(Neon.TESTNET, testKeys.a.address).then((response) => {
      response.Neo.should.be.a('number')
      response.Gas.should.be.a('number')
      done()
    })
  })

  it('should get unspent transactions', (done) => {
    Neon.getBalance(Neon.TESTNET, testKeys.a.address, Neon.ansId).then((response) => {
      response.unspent.Neo.should.be.an('array')
      response.unspent.Gas.should.be.an('array')
      done()
    })
  })

  it.only('should send NEO', (done) => {
    Neon.doSendAsset(testNet, testKeys.b.address, testKeys.a.wif, 'Neo', 1).then((response) => {
      response.result.should.equal(true)
      // send back so we can re-run
      return Neon.doSendAsset(testNet, testKeys.a.address, testKeys.b.wif, 'Neo', 1)
    }).then((response) => {
      response.result.should.equal(true)
      done()
    })
  })

  it('should send GAS', (done) => {
    Neon.doSendAsset(testNet, testKeys.b.address, testKeys.a.wif, 'Gas', 1).then((response) => {
      response.result.should.equal(true)
      // send back so we can re-run
      Neon.doSendAsset(testNet, testKeys.a.address, testKeys.b.wif, 'Gas', 1).then((response) => {
        response.result.should.equal(true)
        done()
      })
    })
  })
})
