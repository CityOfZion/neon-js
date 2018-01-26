****
NEP2
****

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


.. autofunction:: nep2.encrypt
  :short-name:

.. autofunction:: nep2.decrypt
  :short-name:
