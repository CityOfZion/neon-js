import * as NEP2 from '../../src/wallet/nep2'
import { isNEP2, isWIF } from '../../src/wallet/verify'
import testKeys from '../testKeys.json'

describe.only('NEP2', function () {
  const simpleScrypt = {
    cost: 256,
    blockSize: 1,
    parallel: 1,
    size: 64
  }

  describe('Basic (NEP2)', function () {
    this.timeout(10000)
    it('encrypt', () => {
      const encrypted = NEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase)
      isNEP2(encrypted).should.equal(true)
      encrypted.should.equal(testKeys.a.encryptedWif)
    })

    it('decrypt', () => {
      const wif = NEP2.decrypt(testKeys.a.encryptedWif, testKeys.a.passphrase)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Non-english', function () {
    let encrypted
    const passphrase = testKeys.b.passphrase

    it('encrypt', () => {
      encrypted = NEP2.encrypt(testKeys.a.wif, passphrase, simpleScrypt)
      isNEP2(encrypted).should.equal(true)
    })

    it('decrypt', () => {
      const wif = NEP2.decrypt(encrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Symbols', function () {
    let encrypted
    const passphrase = testKeys.c.passphrase

    it('encrypt', () => {
      encrypted = NEP2.encrypt(testKeys.a.wif, passphrase, simpleScrypt)
      isNEP2(encrypted).should.equal(true)
    })

    it('decrypt', () => {
      const wif = NEP2.decrypt(encrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })
  })

  it('Errors on wrong password', () => {
    const encrypted = NEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase, simpleScrypt)
    const thrower = () => NEP2.decrypt(encrypted, 'wrongpassword', simpleScrypt)
    thrower.should.throw()
  })

  it('Errors on wrong scrypt params', () => {
    const thrower = () => NEP2.decrypt(testKeys.a.encryptedWif, testKeys.a.passphrase, simpleScrypt)
    thrower.should.throw()
  })
})
