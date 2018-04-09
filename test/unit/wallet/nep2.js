import * as NEP2 from '../../../src/wallet/nep2'
import { isNEP2, isWIF } from '../../../src/wallet/verify'
import testKeys from '../testKeys.json'

describe('NEP2', function () {
  const simpleScrypt = {
    cost: 256,
    blockSize: 1,
    parallel: 1,
    size: 64
  }

  describe('Basic (NEP2)', function () {
    this.timeout(0)
    let encrypted
    it('encrypt', () => {
      encrypted = NEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase)
      isNEP2(encrypted).should.equal(true)
      encrypted.should.equal(testKeys.a.encryptedWif)
    })

    it('decrypt', () => {
      const wif = NEP2.decrypt(encrypted, testKeys.a.passphrase)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Non-english', function () {
    let encrypted
    let asyncEncrypted
    const passphrase = testKeys.b.passphrase

    it('encrypt', () => {
      encrypted = NEP2.encrypt(testKeys.a.wif, passphrase, simpleScrypt)
      isNEP2(encrypted).should.equal(true)
    })

    it('encryptAsync', async () => {
      const encryptedKey = await NEP2.encryptAsync(testKeys.a.wif, passphrase, simpleScrypt)
      asyncEncrypted = encryptedKey
      return isNEP2(asyncEncrypted).should.equal(true)
    })

    it('decrypt', () => {
      const wif = NEP2.decrypt(encrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })

    it('decryptAsync', async () => {
      const wif = await NEP2.decryptAsync(asyncEncrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      return wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Symbols', function () {
    let encrypted
    let asyncEncrypted
    const passphrase = testKeys.c.passphrase

    it('encrypt', () => {
      encrypted = NEP2.encrypt(testKeys.a.wif, passphrase, simpleScrypt)
      isNEP2(encrypted).should.equal(true)
    })

    it('encryptAsync', async () => {
      const encryptedKey = await NEP2.encryptAsync(testKeys.a.wif, passphrase, simpleScrypt)
      asyncEncrypted = encryptedKey
      return isNEP2(asyncEncrypted).should.equal(true)
    })

    it('decrypt', () => {
      const wif = NEP2.decrypt(encrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      wif.should.equal(testKeys.a.wif)
    })

    it('decryptAsync', async () => {
      const wif = await NEP2.decryptAsync(asyncEncrypted, passphrase, simpleScrypt)
      isWIF(wif).should.equal(true)
      return wif.should.equal(testKeys.a.wif)
    })
  })

  describe('Error', function () {
    const encrypted = NEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase, simpleScrypt)

    it('Errors on wrong password (sync)', () => {
      const thrower = () => NEP2.decrypt(encrypted, 'wrongpassword', simpleScrypt)
      thrower.should.throw()
    })
    it('Errors on wrong scrypt params (sync)', () => {
      const thrower = () => NEP2.decrypt(testKeys.a.encryptedWif, testKeys.a.passphrase, simpleScrypt)
      thrower.should.throw()
    })

    it('Errors on wrong password (async)', () => {
      const thrower = NEP2.decryptAsync(encrypted, 'wrongpassword', simpleScrypt)
      return thrower.should.be.rejectedWith(Error, 'Wrong Password')
    })

    it('Errors on wrong scrypt params (async)', () => {
      const thrower = NEP2.decryptAsync(testKeys.a.encryptedWif, testKeys.a.passphrase, simpleScrypt)
      return thrower.should.be.rejectedWith(Error, `scrypt parameters`)
    })
  })
})
