import Account from '../../../src/wallet/Account'
import testWallet from './testWallet.json'

describe('Account', function () {
  const acct = {
    encrypted: '6PYWVp3xfXQfKY4S14738y8iDqm29gwnzZ86pQ8sMeUtkrzVe4zfzRuv31',
    WIF: 'L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG',
    privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69',
    publicKey: '031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9',
    publicKeyUnencoded: '041d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c94617303f7408d9abfedfb6fbb00dd07e3e7735d918bbea7a7e2c1895ea1bc9b9',
    scriptHash: '5df31f6f59e6a4fbdd75103786bf73db1000b235',
    address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s'
  }

  const scryptParams = {
    cost: 256,
    blockSize: 1,
    parallel: 1
  }

  const keyphrase = 'thisisakeyphrase'
  describe('Constructor', function () {
    it('can be created with different formats', () => {
      Object.keys(acct).map((key) => {
        const a = new Account(acct[key])
        a.should.not.equal(undefined)
        if (key === 'publicKeyUnencoded') {
          a.publicKey.should.equal(acct.publicKey)
          return
        }
        a[key].should.equal(acct[key])
      })
    })

    it('can be created from Wallet Account object', () => {
      const walletAcct = testWallet.accounts[0]
      const a = new Account(walletAcct)
      a.should.not.equal(undefined)
      a.encrypted.should.equal(walletAcct.key)
      a.address.should.equal(walletAcct.address)
    })

    it('exports to a Wallet Account object', () => {
      const walletAcct = testWallet.accounts[0]
      const a = new Account(walletAcct)
      const result = a.export()
      result.should.eql(testWallet.accounts[0])
    })

    it('Accepts both public key forms', () => {
      const a = new Account(acct.publicKeyUnencoded)
      a.address.should.equal(acct.address)
      a.publicKey.should.equal(acct.publicKey)
      a.getPublicKey(false).should.equal(acct.publicKeyUnencoded)
      a.getPublicKey(true).should.equal(acct.publicKey)
    })

    it('Accepts a partial Account object and setup defaults', () => {
      const result = new Account({
        key: acct.encrypted,
        address: acct.address
      })
      result.label.should.equal(acct.address)
      result.isDefault.should.equal(false)
      result.lock.should.equal(false)
      result.contract.should.eql({
        script: '',
        parameters: [{ name: 'signature', type: 'Signature' }],
        deployed: false
      })
    })
  })

  it('can query different key formats', () => {
    const a = new Account(acct.WIF)
    a.should.not.equal(undefined)
    a.privateKey.should.equal(acct.privateKey)
    a.publicKey.should.equal(acct.publicKey)
    a.scriptHash.should.equal(acct.scriptHash)
    a.address.should.equal(acct.address)
  })

  it('encrypts the key', () => {
    const a = new Account(acct.WIF)
    a.encrypt(keyphrase, scryptParams)
    a.encrypted.should.equal(acct.encrypted)
  })

  it('decrypts the key', () => {
    const a = new Account(acct.encrypted)
    a.decrypt(keyphrase, scryptParams)
    a.WIF.should.equal(acct.WIF)
  })

  it('throws error when insufficient information given', () => {
    const a = new Account(acct.address)
    const thrower = () => a.privateKey
    thrower.should.throw()
  })
})
