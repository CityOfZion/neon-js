******
Claims
******

The Claims class is a collection of claims data belonging to an account. It is usually retrieved from a 3rd part API. We do not recommend you craft your own Claims manually. This class is here for completeness in terms of high level objects.

Like Balance, the constructor is the way to convert a Claims-like object into a ``neon-js`` Claims object. This is the primary method we use to convert the claims object we get from 3rd party API.

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

