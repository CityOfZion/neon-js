****************
Wallet
****************

.. toctree::
  :hidden:

  Account
  Balance
  Claims
  Wallet
  methods/index.rst

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


.. rubric:: :doc:`Account`

Accounts class allowing simple conversion between different key formats.

::

  import Neon from '@cityofzion/neon-js'
  const account = Neon.create.account(privateKey)
  let publicKey = account.publicKey
  let address = account.address

  const account2 = Neon.create.account(publicKey)
  account.privateKey // Throws error

.. rubric:: :doc:`Balance`

Balance describes the amount of assets contained at a single address. It can hold both native assets as well as NEP5 token balances. It is used to create transactions.

.. rubric:: :doc:`Claims`

Claims is an object that contains a list of ``ClaimItem`` that is used to construct a ``ClaimTransaction``.

.. rubric:: :doc:`Wallet`

Wallet is a collection of accounts contained within a single file conforming to the NEP6 definition. This can be exported as a ``json`` file and contains the necessary information for any standard wallet to open.

Methods
-------

All methods documented are available at the root of the ``wallet`` module. They are categorised according to their place in the code files.

::

  import {wallet} from '@cityofzion/neon-js'
  wallet.getScriptHashFromAddress('ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW') // core
  wallet.Coin({index:0, txid:'a', value: 1}) // components
  wallet.encrypt('L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g') //nep2
  wallet.isAddress('ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW') // verify

.. rubric:: :doc:`methods/core`

Methods for transforming between key formats.

.. rubric:: :doc:`methods/components`

Components used in constructing the ``Balance`` and ``Claims`` object.

.. rubric:: :doc:`methods/nep2`

Methods for encrypting or decrypting keys.

.. rubric:: :doc:`methods/verify`

Methods to verify the various key formats.

