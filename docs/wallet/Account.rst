*******
Account
*******
The Account class is constructed from a given key and provides methods to derive all other key formats from the given key. The class is smart enough to differentiate between the different key formats and assign them correctly. Once an ``Account`` object is created from a key, all other higher level keys can be derived and retrieved. You are unable to derive a lower level key from a higher level.

The keys are arranged below starting from the lowest level:

1. Encrypted Key (NEP2)
2. Private Key (HEX or WIF)
3. Public Key
4. ScriptHash
5. Address

For example, you cannot derive a private key from a Account created using a Public Key. (``Account`` will throw an error)
From the same ``Account``, you can retrieve the scriptHash and the address.

The Account class can only be created from encrypted key, private key, public key, or address. ScriptHash is not accepted as there is currently no way to verify if a scripthash is legitimate.

.. autoclass:: Account
    :members:
    :exclude-members: encrypted, WIF, privateKey, publicKey, scriptHash, address

    .. autoattribute:: Account#encrypted
    .. autoattribute:: Account#WIF
    .. autoattribute:: Account#privateKey
    .. autoattribute:: Account#publicKey
    .. autoattribute:: Account#scriptHash
    .. autoattribute:: Account#address


