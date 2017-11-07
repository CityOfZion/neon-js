import {
  hexstring2ab,
  ab2hexstring
} from '../src/utils'
import * as Neon from '../src/index'

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
  // it.skip('should claim GAS', () => {
  //   return Neon.doClaimAllGas('TestNet', testKeys.b.wif)
  //     .then((response) => {
  //       console.log('claim', response)
  //     }).catch((e) => {
  //       console.log(e)
  //       throw e
  //     })
  // })

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

  it('should encrypt a WIF using nep2', () => {
    return Neon.encryptWIF(testKeys.a.wif, testKeys.a.passphrase)
      .then((result) => {
        result.should.equal(testKeys.a.encryptedWif)
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

  it('should show that Neo address passes validation', (done) => {
    Neon.verifyAddress(testKeys.a.address).should.equal(true)
    done()
  })

  it('should show that btc address fails validation', (done) => {
    Neon.verifyAddress('1BoatSLRHtKNngkdXEeobR76b53LETtpyT').should.equal(false)
    done()
  })

  it('should decrypt a WIF using nep2', () => {
    return Neon.decryptWIF(testKeys.a.encryptedWif, testKeys.a.passphrase)
      .then((result) => {
        result.should.equal(testKeys.a.wif)
      }).catch((e) => {
        console.log(e)
        throw e
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
        return Neon.doSendAsset("TestNet", testKeys.a.address, testKeys.b.wif, { 'NEO': 1 })
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

  it('should allow custom API endpoint, i.e. for private net', done => {
    const customEndpoint = 'http://localhost:5000'
    const privNet = Neon.getAPIEndpoint(customEndpoint)
    privNet.should.equal(customEndpoint)
    done()
  })
  
  // this test passes, but cannot be run immediately following previous tests given state changes
  // it.skip('should send NEO and GAS', (done) => {
  //   return Neon.doSendAsset('TestNet', testKeys.b.address, testKeys.a.wif, { 'GAS': 1, 'NEO': 1 })
  //     .then((response) => {
  //       response.should.have.property('result', true)
  //       // send back so we can re-run
  //       return Neon.doSendAsset('TestNet', testKeys.a.address, testKeys.b.wif, { 'GAS': 1, 'NEO': 1 })
  //     })
  //     .then((response) => {
  //       response.should.have.property('result', true)
  //       done()
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //       throw e
  //     })
  // })
})
