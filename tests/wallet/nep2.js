import * as NEP2 from '../../src/wallet/nep2'
import { isNEP2, isWIF } from '../../src/wallet/verify'
import testKeys from '../testKeys.json'

describe('NEP2', function () {
  const simpleScrypt = {
    cost: 256,
    blockSize: 1,
    parallel: 1,
    size: 64
  }

  const medScrypt = {
    cost: 16384,
    blockSize: 8,
    parallel: 8
  }

  describe('Basic (NEP2)', function () {
    this.timeout(10000)
    let encrypted
    it('encrypt', () => {
      encrypted = NEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase, medScrypt)
      console.log(encrypted)
      isNEP2(encrypted).should.equal(true)
    })

    it('decrypt', () => {
      const wif = NEP2.decrypt(encrypted, testKeys.a.passphrase, medScrypt)
      console.log(wif)
      isWIF(wif).should.equal(true)
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
