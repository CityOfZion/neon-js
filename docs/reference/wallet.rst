**********
Wallet
**********

Module ``wallet``

.. autoclass:: Account
    :members:
    :exclude-members: encrypted, WIF, privateKey, publicKey, scriptHash, address

    .. autoattribute:: Account#encrypted
    .. autoattribute:: Account#WIF
    .. autoattribute:: Account#privateKey
    .. autoattribute:: Account#publicKey
    .. autoattribute:: Account#scriptHash
    .. autoattribute:: Account#address


.. autoclass:: Balance
    :members:
    :exclude-members: address, net, assetSymbols, assets, tokenSymbols, tokens

    .. autoattribute:: Balance#address
    .. autoattribute:: Balance#net
    .. autoattribute:: Balance#assetSymbols
    .. autoattribute:: Balance#assets
    .. autoattribute:: Balance#tokenSymbols
    .. autoattribute:: Balance#tokens

.. autofunction:: nep2.encrypt

.. autofunction:: nep2.decrypt

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

.. autofunction:: isAddress

.. autofunction:: isPrivateKey

.. autofunction:: isPublicKey

.. autofunction:: isNEP2

.. autofunction:: isWIF

.. autoclass:: Wallet
    :members:
    :exclude-members: name, version, scrypt, accounts, extra

    .. autoattribute:: Wallet#name
    .. autoattribute:: Wallet#version
    .. autoattribute:: Wallet#scrypt
    .. autoattribute:: Wallet#accounts
    .. autoattribute:: Wallet#extra
