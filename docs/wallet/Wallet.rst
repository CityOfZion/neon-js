******
Wallet
******

The Wallet class manages an array of Accounts. It gives the user a high level control over multiple Accounts. For example, sending assets from multiple addresses at once in a single Transaction. This is the way to persist Account data through exporting to a file.

::

  import Neon, {wallet} from '@cityofzion/neon-js'
  const w1 = Neon.create.wallet()
  // This generates a new keypair and adds it to w1
  w1.addAccount()
  // Encrypt first account with keyphrase 'abc'
  w1.encrypt(0, 'abc')
  // Export file to ./w1.json
  w1.writeFile('./w1.json')

  // Initialise new wallet with custom parameters
  const w2 = new wallet.Wallet({name: 'wallet2', scrypt: {n:2,r:1,p:1}})

  // Read a wallet file and returns a Wallet object
  const w3 = wallet.Wallet.readFile('./w3.json')

.. autoclass:: Wallet
    :members:
    :exclude-members: name, version, scrypt, accounts, extra

    .. autoattribute:: Wallet#name
    .. autoattribute:: Wallet#version
    .. autoattribute:: Wallet#scrypt
    .. autoattribute:: Wallet#accounts
    .. autoattribute:: Wallet#extra
