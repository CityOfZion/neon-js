****
Core
****

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

There are no checks in place for this set of methods to ensure the inputs are proper. Errors may be thrown when conversion fails for certain methods.

.. autofunction:: generatePrivateKey

.. autofunction:: generateRandomArray

.. autofunction:: generateSignature

.. autofunction:: getAddressFromScriptHash

.. autofunction:: getPrivateKeyFromWIF

.. autofunction:: getPublicKeyFromPrivateKey

.. autofunction:: getScriptHashFromAddress

.. autofunction:: getScriptHashFromPublicKey

.. autofunction:: getVerificationScriptFromPublicKey

.. autofunction:: getWIFFromPrivateKey
