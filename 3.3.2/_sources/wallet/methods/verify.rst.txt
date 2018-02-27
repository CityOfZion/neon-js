******
Verify
******

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

.. autofunction:: isAddress

.. autofunction:: isPrivateKey

.. autofunction:: isPublicKey

.. autofunction:: isNEP2

.. autofunction:: isWIF
