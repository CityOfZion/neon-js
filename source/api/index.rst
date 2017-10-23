***
API
***

The ``api`` module is exposed as::

  import Neon from 'neon-js'
  Neon.get.balance('TestNet', address)
  Neon.get.tokenBalance(contractScriptHash)

  import {api} from 'neon-js'
  api.getBalance('TestNet', address)

The ``api`` module contains all 3rd party API that is useful together with Neon. The main highlight is the NeonDB API which provides the necessary information to construct a ClaimTransaction or ContractTransaction. A normal NEO node does not provide us with a convenient way of retrieving the balance or claimable transactions through RPC.

However, do note that these APIs rely on hosted nodes by 3rd party and thus use them at your own risk.

NeonDB
-------

The NeonDB API is exposed as::

  import Neon from 'neon-js'
  Neon.get.balance('TestNet', address)
  Neon.do.claimAllGas('TestNet', privateKey)

  import {api} from 'neon-js'
  api.getBalance('TestNet', address)
  api.doClaimAllGas('TestNet', privateKey)

The NeonDB API describes the API set exposed by neon-wallet-db_ as well as other convenient methods. The node is hosted by CityOfZion.

The API returns useful information that is not built into standard NEO nodes such as claimable transactions or spendable coins. These information are used to construct transactions.

For example, the ``getBalance`` method returns a list of spendable assets of a specific address. This is then used to construct a ContractTransaction.

CoinMarketCap
-------------

A straightforward call to CoinMarketCap API to retrieve the latest price information.

::

  import Neon from 'neon-js'
  Neon.get.price('NEO', 'EUR')
  Neon.get.price('GAS') // defaults to USD

  import { api } from 'neon-js'
  api.getPrice('NEO', 'SGD')


.. _neon-wallet-db: https://github.com/CityOfZion/neon-wallet-db

NEP5
-----

The NEP5 Standard describes a set of methods to implement as a token in a smart contract. This is the NEO equivalent of the ERC-20 token standard in Ethereum.

This set of methods rely on the NEO node having version >= 2.3.3. The method uses ``DEFAULT_RPC`` found in constants as the default node.

::

  import Neon from 'neon-js'
  const rpxScriptHash = Neon.CONST.CONTRACTS.TEST_RPX
  Neon.get.tokenInfo(rpxScriptHash)
  Neon.get.tokenBalance(rpxScriptHash, address)

  import { api } from 'neon-js'
  api.getTokenInfo(rpxScriptHash)
  api.getTokenBalance(rpxScriptHash)
