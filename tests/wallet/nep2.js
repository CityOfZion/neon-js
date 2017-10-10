import * as NEP2 from '../../src/wallet/nep2'
import testKeys from '../testKeys.json'

describe('NEP2', function () {
  this.timeout(15000)

  it('should encrypt WIF', () => {
    const encryptedKey = NEP2.encrypt(testKeys.a.wif, testKeys.a.passphrase)
    encryptedKey.should.equal(testKeys.a.encryptedWif)
  })

  it('should encrypt non-english passphrases', () => {
    const encryptedKey = NEP2.encrypt(testKeys.b.wif, testKeys.b.passphrase)
    encryptedKey.should.equal(testKeys.b.encryptedWif)
  })

  it('should encrypt passphrase with symbols', () => {
    const encryptedKey = NEP2.encrypt(testKeys.c.wif, testKeys.c.passphrase)
    encryptedKey.should.equal(testKeys.c.encryptedWif)
  })

  it('should decrypt WIF', () => {
    const wif = NEP2.decrypt(testKeys.a.encryptedWif, testKeys.a.passphrase)
    wif.should.equal(testKeys.a.wif)
  })

  it('should decrypt non-english passphrases', () => {
    const wif = NEP2.decrypt(testKeys.b.encryptedWif, testKeys.b.passphrase)
    wif.should.equal(testKeys.b.wif)
  })

  it('should decrypt passphrase with symbols', () => {
    const wif = NEP2.decrypt(testKeys.c.encryptedWif, testKeys.c.passphrase)
    wif.should.equal(testKeys.c.wif)
  })

  it('should throw error on wrong password', () => {
    const thrower = () => NEP2.decrypt(testKeys.a.encryptedWif, 'wrongpassword')
    thrower.should.throw()
  })
})
