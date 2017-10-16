****************
Light Wallet API
****************

The light wallet API is exposed as::

  import Neon from 'neon-js'
  Neon.api.getBalance('TestNet', address)

  import {api} from 'neon-js'
  api.getBalance('TestNet', address)

The Light Wallet API describes the API set exposed by neon-wallet-db_ as well as other convenient methods. The node is hosted by CityOfZion.

The API returns useful information that is not built into standard NEO nodes such as claimable transactions or spendable coins. These information are used to construct transactions.

For example, the ``getBalance`` method returns a list of spendable assets of a specific address. This is then used to construct a ContractTransaction.

.. toctree::
   :maxdepth: 1
   :caption: Contents:

.. _neon-wallet-db: https://github.com/CityOfZion/neon-wallet-db
