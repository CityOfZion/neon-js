****************
Wallet
****************

The Wallet module is exposed as::

  import Neon from '@cityofzion/neon-js'
  const account = Neon.create.account(privateKey)
  Neon.is.address(string)

  import {wallet} from '@cityofzion/neon-js'
  const account = new wallet.Account(privateKey)
  wallet.isAddress(string)

The Wallet module contains the core methods for manipulating keys, creating signatures and verifying keys.

::

  import neon from '@cityofzion/neon-js'
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

  import Neon from '@cityofzion/neon-js'
  const account = Neon.create.account(privateKey)
  let publicKey = account.publicKey
  let address = account.address

  const account2 = Neon.create.account(publicKey)
  account.privateKey // Throws error

Balance
=======

The Balance class stores the balance of the account. It is usually retrieved using a 3rd party API as NEO nodes do not have a RPC call to easily retrieve this information with a single call.

::

  import Neon from '@cityofzion/neon-js'
  Neon.create.balance({net: 'TestNet', address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'})

  import {wallet, api} from '@cityofzion/neon-js'
  // This form is useless as it is an empty balance.
  const balance = new wallet.Balance({net: 'TestNet', address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'})
  // We get a useful balance that can be used to fill a transaction through api
  const filledBalance = api.getBalanceFrom('ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW', api.neonDB)
  // This contains all symbols of assets available in this balance
  const symbols = filledBalance.assetSymbols
  // We retrieve the unspent coins from the assets object using the symbol
  const neoCoins = filledBalance.assets['NEO'].unspent
  // We can verify the information retrieved using verifyAssets
  filledBalance.verifyAssets('https://seed1.neo.org:20332')

The Balance class is used to track the unspent coins available to construct transactions with. ``verifyAssets`` is a handy method to make sure the unspent coins provided by the 3rd party API is really unspent by verifying them against a NEO node. However, this is an expensive operation so use sparingly.


Core
====

The core methods available are methods to convert key formats and generate new private keys.

Do note that the methods available is not the full set but only the minimum required. Generally, there is a method to retrieve the lower key from the higher key. For example, ``getPublicKeyFromPrivateKey`` exists but not ``getAddressFromPrivatKey`` or ``getPrivateKeyFromPublicKey``. For conversions across all formats, you are encouraged to use the ``Account`` class.

::

  import Neon from '@cityofzion/neon-js'
  const privateKey = Neon.create.privateKey()
  const publicKey = Neon.get.publicKeyFromPrivateKey(publicKey)
  const scriptHash = Neon.get.scriptHashFromPublicKey(publicKey)
  const address = Neon.get.addressFromScriptHash(scriptHash)



  import { wallet } from '@cityofzion/neon-js'
  const privateKey = wallet.generatePrivateKey()
  const publicKey = wallet.getPublicKeyFromPrivateKey(privateKey)
  const scriptHash = wallet.getScriptHashFromPublicKey(publicKey)
  const address = wallet.getAddressFromScriptHash(scriptHash)


NEP2
====

The NEP2 standard describes the procedure to encrypt or decrypt a private key. The encryption method accepts either a WIF or HEX private key. However, the decryption method will always return a WIF for consistency.

Do note that the encryption/decryption takes a long time and might not work very nicely in browsers.

::

  import Neon from '@cityofzion/neon-js'
  const privateKey = Neon.create.privateKey()
  const WIF = Neon.get.WIFFromPrivateKey(privateKey)
  const nep2Key = Neon.encrypt(privateKey, 'myPassword')
  const decryptedKey = Neon.decrypt(nep2Key, 'myPassword')
  WIF === decryptedKey // true

  import { wallet }
  const privateKey = wallet.generatePrivateKey()
  const WIF = new wallet.Account(privateKey).WIF
  const nep2Key = wallet.encrypt(WIF, 'myPassword')
  const decryptedKey = wallet.decrypt(nep2Key, 'myPassword')
  WIF === decryptedKey // true

Verify
======

Verification methods for the various key formats are available::

  import Neon from '@cityofzion/neon-js'
  Neon.is.address(addrStr)
  Neon.is.privateKey(keyStr)
  Neon.is.NEP2(encryptedStr)

  import {wallet} from '@cityofzion/neon-js'
  wallet.isAddress(addrStr)
  wallet.isPrivateKey(keyStr)
  wallet.isNEP2(keyStr)

These methods will return a boolean regarding the key format. No errors will be thrown.

Wallet
======

The Wallet class manages an array of Accounts. It gives the user a high level control over multiple Accounts. For example, sending assets from multiple addresses at once in a single Transaction. This is the way to persist Account data through exporting to a file.

::

  import Neon, {wallet} from '@cityofzion/neon-js'
  const w1 = Neon.create.wallet()
  // This generates a new keypair and adds it to w1
  w1.addAccount()
  // Encrypt first account with keyphrase 'abc'
  w1.encrypt(0, 'abc')
  // Export file to ./w1.json
  w1.writeFile('./w1.json')

  // Initialise new wallet with custom parameters
  const w2 = new wallet.Wallet({name: 'wallet2', scrypt: {n:2,r:1,p:1}})

  // Read a wallet file and returns a Wallet object
  const w3 = wallet.Wallet.readFile('./w3.json')

