********
Wallet
********

Account
-------

The Account is an object that contains all keys generated from the key provided.

.. autofunction:: Account

This object is generated through the following methods::

  import * as Neon from 'neon-js'

  Neon.getAccountFromWIFKey(WIFKey)
  Neon.getAccountFromPrivateKey(privateKey)
  Neon.getAccountFromPublicKey(publicKey)

Do note that the account generated from ``getAccountFromPublicKey`` will not contain ``privateKey`` as it is impossible to find that out from a public key.

Generation
----------

You can generate new keys using::

  import * as Neon from 'neon-js'
  let newKey = Neon.generatePrivateKey()
  let newAccount = Neon.getAccountFromPrivateKey(newKey)

Manipulation
------------

There are various key manipulation methods available. You are encouraged to use the Account methods for ease of access. However, if you want more specific transformations, do refer to the source code.

  import * as Neon from 'neon-js'

  let publicKey = Neon.getPublicKey(privateKey, false)
  let publicKeyEncoded = neon.getPublicKeyEncoded(publicKey)
  let scriptHash = Neon.getScriptHashFromPublicKey(publicKeyEncoded)


Verification
------------

There are 2 methods for verifying address and encoded public key.

  import * as Neon from 'neon-js'
  Neon.verifyAddress(address)
  Neon.verifyPublicKeyEncoded(publicKeyEncoded)
