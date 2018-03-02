import Wallet from '../../../src/wallet/Wallet'
import Account from '../../../src/wallet/Account'
import simpleWallet from './simpleWallet.json'
import testWallet from './testWallet.json'
import { DEFAULT_SCRYPT } from '../../../src/consts'

describe('Wallet file', function () {
  describe('Constructor', function () {
    it('default', () => {
      const w = new Wallet()
      w.should.not.equal(undefined)
      w.name.should.equal('myWallet')
    })

    it('only name', () => {
      const w = new Wallet({ name: 'NamedWallet' })
      w.should.not.equal(undefined)
      w.name.should.equal('NamedWallet')
      const scryptParams = [w.scrypt.n, w.scrypt.r, w.scrypt.p]
      scryptParams.should.eql([DEFAULT_SCRYPT.cost, DEFAULT_SCRYPT.blockSize, DEFAULT_SCRYPT.parallel])
      w.accounts.should.eql([])
    })

    it('custom config', () => {
      const config = {
        name: 'new wallet',
        scrypt: {
          n: 256,
          r: 1,
          p: 1
        }
      }
      const w = new Wallet(config)
      w.name.should.equal(config.name)
      w.scrypt.should.eql(config.scrypt)
      w.accounts.should.eql([])
    })
  })

  describe('get defaultAccount', function () {
    const w = new Wallet(simpleWallet)
    w.decrypt(1, w.accounts[1].label)
    it('returns first default', () => {
      w.defaultAccount.should.equal(w.accounts[2])
    })

    it('returns first decrypted account when no defaults', () => {
      w.accounts[2].isDefault = false
      w.defaultAccount.should.eql(w.accounts[1])
    })

    it('returns first encrypted account when no defaults and decrypted', () => {
      w.accounts[1]._privateKey = undefined
      w.accounts[1]._WIF = undefined
      w.defaultAccount.should.eql(w.accounts[0])
    })
  })

  it('import', () => {
    const testWalletString = JSON.stringify(testWallet)
    const w = Wallet.import(testWalletString)
    w.name.should.equal('MyWallet')
    w.scrypt.should.eql(testWallet.scrypt)
    for (let i = 0; i < w.accounts.length; i++) {
      w.accounts[i].export().should.eql(testWallet.accounts[i])
    }
  })

  it('export', () => {
    const w = new Wallet(testWallet)
    const exportObj = w.export()
    exportObj.should.eql(testWallet)
    const imported = Wallet.import(JSON.stringify(exportObj))
    w.should.eql(imported)
  })

  describe('addAccount', function () {
    const w = new Wallet()
    it('Account', () => {
      const acct = new Account()
      const i = w.addAccount(acct)
      i.should.equal(0)
      w.accounts.length.should.equal(1)
      w.accounts[0].should.eql(acct)
    })

    it('Key', () => {
      const i = w.addAccount('6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF')
      i.should.equal(1)
      w.accounts.length.should.equal(2)
      w.accounts[1].should.be.an.instanceof(Account)
    })
  })

  it('setDefault', () => {
    // Original default is index 1
    const w = new Wallet(testWallet)
    w.accounts[1].isDefault.should.equal(true)
    const newDefault = 2
    w.setDefault(newDefault)
    for (let i = 0; i < w.accounts.length; i++) {
      w.accounts[i].isDefault.should.equal(i === newDefault)
    }
  })

  describe('decrypt/encrypt', function () {
    const w = new Wallet(simpleWallet)
    it('decryptAll', () => {
      const decrypted = w.decryptAll(simpleWallet.accounts[1].label)
      decrypted.should.eql([false, true, false, false, false])
      w.accounts[1].privateKey.should.not.equal(undefined)
    })

    it('encryptAll', () => {
      const encrypted = w.encryptAll(simpleWallet.accounts[1].label)
      encrypted.should.eql([false, true, false, false, false])
    })
  })
})
