*******
Balance
*******

::

  class Balance {
      address: string
      net: string
      assetSymbols: string[]
      assets: { [index: string]: AssetBalance }
      tokenSymbols: string[]
      tokens: { [index: string]: number }
  }

The Balance class stores the balance of the account. It is usually retrieved using a 3rd party API as NEO nodes do not have a RPC call to easily retrieve this information with a single call.

::

  import Neon from '@cityofzion/neon-js'
  Neon.create.balance({net: 'TestNet', address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'})

  import {wallet, api} from '@cityofzion/neon-js'
  // This form is useless as it is an empty balance.
  const balance = new wallet.Balance({net: 'TestNet', address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW'})
  // We get a useful balance that can be used to fill a transaction through api
  const filledBalance = api.getBalanceFrom('ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW', api.neonDB)
  // This contains all symbols of assets available in this balance
  const symbols = filledBalance.assetSymbols
  // We retrieve the unspent coins from the assets object using the symbol
  const neoCoins = filledBalance.assets['NEO'].unspent
  // We can verify the information retrieved using verifyAssets
  filledBalance.verifyAssets('https://seed1.neo.org:20332')

The Balance class is used to track the unspent coins available to construct transactions with. ``verifyAssets`` is a handy method to make sure the unspent coins provided by the 3rd party API is really unspent by verifying them against a NEO node. However, this is an expensive operation so use sparingly.

The constructor is a handy method to convert a Balance-like javascript object into a ``neon-js`` Balance.

.. autoclass:: Balance
    :members:
    :exclude-members: address, net, assetSymbols, assets, tokenSymbols, tokens

    .. autoattribute:: Balance#address
    .. autoattribute:: Balance#net
    .. autoattribute:: Balance#assetSymbols
    .. autoattribute:: Balance#assets
    .. autoattribute:: Balance#tokenSymbols
    .. autoattribute:: Balance#tokens
