*******
Account
*******

The Account class is constructed from a given key and provides methods to derive all other key formats from the given key. Do note that you are unable to derive a lower level key from a higher level.

The keys are arranged as:

1. Encrypted Key (NEP2)
2. Private Key (HEX or WIF)
3. Public Key
4. ScriptHash
5. Address

The Account class can only be created from encrypted key, private key, public key, or address. ScriptHash is not accepted.

You cannot derive a private key from a Account created using a Public Key. (Account will throw an error)

.. autoclass:: Account
    :members:
    :exclude-members: encrypted, WIF, privateKey, publicKey, scriptHash, address

    .. autoattribute:: Account#encrypted
    .. autoattribute:: Account#WIF
    .. autoattribute:: Account#privateKey
    .. autoattribute:: Account#publicKey
    .. autoattribute:: Account#scriptHash
    .. autoattribute:: Account#address

