*******
Account
*******

The ``Account`` class is used to store and transform keys to its various formats. It can be instantiated with any key format and is smart enough to recognise the format and store it appropriately.

::

  import Neon, {wallet} from '@cityofzion/neon-js'

  const a = Neon.create.Account('ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s')
  console.log(a.address) // ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s

  const b = new wallet.Account('9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69')
  console.log(b.privateKey) // 9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69

The class enables us to easily retrieve keys in any derivable format without needing to remember any methods. However, we can only retrieve formats that can be derived from our input. For example, we cannot retrieve any formats other than address and scripthash from ``a`` because we instantiated it with an address. However, we can get any format from ``b`` because it was instantiated with a private key, which is the lowest level key available.

::

  console.log(a.publicKey) // throws an error
  console.log(b.publicKey) // prints the public key
  console.log(b.address) // prints the address

The order of the keys are:

0. encrypted (NEP2)
1. privateKey / WIF
2. publicKey
3. scriptHash
4. address

(these are the getters)

When you instantiate a ``Account`` with a key, you can retrieve any format that is below it in the list. For example, if we instantiate with a public key, we can get the publc key, scriptHash and address but not the private key.

The Account class can only be instantiated from encrypted key, private key, public key, or address. ScriptHash is not accepted as there is currently no way to verify if a scripthash is legitimate.

The ``encryptedKey`` is special as it is the lowest level key but requires the user to unlock it first before we can derive anything from it. This can be done through the ``decrypt`` method.

::

  const c = new wallet.Account('6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF')
  console.log(c.encrypted) // encrypted key
  console.log(c.address) // throws error
  c.decrypt('city of zion')
  console.log(c.address) // ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW

You can encrypt the key by using the ``encrypt`` method. This is necessary if you want to export this key to a JSON file.

::

  c.encrypt('new password')

This action will encrypt the private key with the provided password and replace any old NEP2 key.

.. autoclass:: Account
    :members:
    :exclude-members: encrypted, WIF, privateKey, publicKey, scriptHash, address

    .. autoattribute:: Account#encrypted
    .. autoattribute:: Account#WIF
    .. autoattribute:: Account#privateKey
    .. autoattribute:: Account#publicKey
    .. autoattribute:: Account#scriptHash
    .. autoattribute:: Account#address


