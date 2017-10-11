import * as core from './core'
import * as verify from './verify'
import * as nep2 from './nep2'
import Account from './Account'

export default {
  create: {
    account: (k) => new Account(k),
    privateKey: core.generatePrivateKey,
    signature: core.generateSignature
  },
  is: {
    address: verify.isAddress,
    publicKey: verify.isPublicKey,
    encryptedKey: verify.isNEP2,
    privateKey: verify.isPrivateKey,
    wif: verify.isWIF
  },
  encrypt: {
    privateKey: nep2.encrypt
  },
  decrypt: {
    privateKey: nep2.decrypt
  },
  get: {
    privateKeyFromWIF: core.getPrivateKeyFromWIF,
    WIFFromPrivateKey: core.getWIFFromPrivateKey,
    publicKeyFromPrivateKey: core.getPublicKeyFromPrivateKey,
    scriptHashFromPublicKey: core.getScriptHashFromPublicKey,
    addressFromScriptHash: core.getAddressFromScriptHash,
    scriptHashFromAddress: core.getScriptHashFromAddress
  }
}

export * from './core'
export * from './verify'
export * from './nep2'
export { Account }
