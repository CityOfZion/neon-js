******
Wallet
******

The ``Wallet`` class implements the NEP-6 convention which is a standard way set by NEO council on how to export keys in a JSON file. By doing this, we can move keys across different software providers without worry.

The ``Wallet`` class is essentially a collection of encrypted keys as well as the parameters used to encrypt them.

::

  import Neon, {wallet} from 'cityofzion/neon-js'

  const a = new wallet.Account('6PYLHmDf6AjF4AsVtosmxHuPYeuyJL3SLuw7J1U8i7HxKAnYNsp61HYRfF')
  const b = new wallet.Account('9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69')

  // We create a wallet with name 'myWallet'. This is optional. The constructor is fine with no arguments.
  const w1 = Neon.create.wallet({name: 'myWallet'})

  // We generate a new Account and add it to the wallet
  w1.addAccount()
  // We add Account a to the wallet.
  w1.addAccount(a)
  // We add Account b to the wallet.
  // Note that Account b is unencrypted and we can add this Account.
  // The wallet will only error when trying to export an unencrypted key but does not prevent you from adding it.
  w1.addAccount(b)


If your Account is not encrypted, it is still possible to add it to the Wallet. However, you will be unable to export the wallet until you encrypt it. The Wallet class provides some helper methods to quickly encrypt or decrypt all accounts.

::

  // encrypting Account a will fail as it has not been unlocked.
  w1.encryptAll('lousypassword') // returns [false, true]

  // we will decrypt a (account at array position 0)
  w1.decrypt(0, 'city of zion')  // returns true
  // so we can encrypt everything with the same password
  w1.encrypt(0, 'lousypassword') // returns true

Similar methods for decryption (``wallet.decrypt``, ``wallet.decryptAll``) is available. Encryption and decryption methods will return booleans which corresponds to the success or failure of the action.

Do note that decrypting does not mean that you cannot export the wallet. Decryption does not erase the old encryption but merely exposes your keys.

Once encrypted, you can proceed to export your wallet through ``writeFile`` or ``export``.

The static method ``readFile`` is available to construct a wallet through reading a JSON file.

::

  // writes to a file on cwd
  w1.writeFile('mywallet.json')

  // exports as JSON string
  const walletString = w1.export()

  // read wallet from file
  const w2 = wallet.Wallet.readFile('mywallet.json')

  // Decryption failed for account[0]
  w2.decryptAll('lousypassword') // returns [true, true]

Notes
-----

- Do note that NEO-GUI does not support multiple passwords.
- It is possible to change the encryption parameters such that it is harder or easier to encrypt/decrypt.

.. autoclass:: Wallet
    :members:
    :exclude-members: name, version, scrypt, accounts, extra

    .. autoattribute:: Wallet#name
    .. autoattribute:: Wallet#version
    .. autoattribute:: Wallet#scrypt
    .. autoattribute:: Wallet#accounts
    .. autoattribute:: Wallet#extra
