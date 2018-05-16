/** @module wallet */

import * as core from './core'
import * as verify from './verify'
import * as nep2 from './nep2'
import * as message from './message'
import Account from './Account'
import Balance from './Balance'
import Wallet from './Wallet'
import Claims from './Claims'
import AssetBalance from './components/AssetBalance'
import Coin from './components/Coin'
import { ClaimItem } from './components/ClaimItem'

export default {
  create: {
    account: (k) => new Account(k),
    privateKey: core.generatePrivateKey,
    signature: core.generateSignature,
    wallet: (k) => new Wallet(k)
  },
  is: {
    address: verify.isAddress,
    publicKey: verify.isPublicKey,
    encryptedKey: verify.isNEP2,
    privateKey: verify.isPrivateKey,
    wif: verify.isWIF,
    scriptHash: verify.isScriptHash
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
  },
  sign: {
    message: message.signMessage
  },
  verify: {
    message: message.verifyMessage
  }
}

export * from './core'
export * from './verify'
export * from './nep2'
export * from './message'
export {
  Account,
  Balance,
  Wallet,
  Claims,
  ClaimItem,
  AssetBalance,
  Coin
}
