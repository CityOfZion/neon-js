****************
Wallet
****************

The Wallet module is exposed as::

  import Neon from 'neon-js'
  const account = Neon.create.account(privateKey)
  Neon.is.address(string)

  import {wallet} from 'neon-js'
  const account = new wallet.Account(privateKey)
  wallet.isAddress(string)

The Wallet module contains the core methods for manipulating keys, creating signatures and verifying keys.

::

  import neon from 'neon-js'
  // Key generation and conversion
  const privateKey = Neon.create.privateKey()
  const wif = Neon.get.WIFFromPrivateKey(privateKey)

  // Encryption / Decryption
  const encrypted = Neon.encrypt.privateKey(privateKey, 'myPassword')
  const decrypted = Neon.decrypt.privateKey(encrypted, 'myPassword')

  // Verify keys
  Neon.is.wif(wif) // true
  Neon.is.publicKey('randomphrase') // false

  // Transaction signing
  const signature = Neon.create.signature(tx, privateKey)

Account
=======

The Account class is constructed from a given key and provides methods to derive all other key formats from the given key. Do note that you are unable to derive a lower level key from a higher level.

The keys are arranged as:

1. Encrypted Key (NEP2)
2. Private Key (HEX or WIF)
3. Public Key
4. ScriptHash
5. Address

The Account class can only be created from a private key, public key, or address. ScriptHash and NEP2 are not accepted.

You cannot derive a private key from a Account created using a Public Key. (Account will throw an error)

::

  import Neon from 'neon-js'
  const account = Neon.create.account(privateKey)
  let publicKey = account.publicKey
  let address = account.address

  const account2 = Neon.create.account(publicKey)
  account.privateKey // Throws error

