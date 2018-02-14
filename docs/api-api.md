---
id: api-api
title: API
---

The API module is exposed as:

```js
import Neon from '@cityofzion/neon-js'
Neon.get.balance('TestNet', address)
Neon.get.tokenBalance(contractScriptHash)

import { api } from '@cityofzion/neon-js'
api.neonDB.getBalance('TestNet', address)
api.cmc.getPrice()
api.sendAsset(config)
```

The `api` module contains all 3rd party API that is useful together with Neon. The main highlight is the NeonDB API which provides the necessary information to construct a ClaimTransaction or ContractTransaction. A normal NEO node does not provide us with a convenient way of retrieving the balance or claimable transactions through RPC.

However, do note that these APIs rely on hosted nodes by 3rd party and thus use them at your own risk.

This module is structured slightly different from the rest of the modules. While the rest of the modules are flat in terms of hierachy, this module is composed of largely many other submodules. Only the core methods are found at the top level of the module.

## Core

These are core methods that help to tie up the different 3rd party APIs in order to simplify transaction creation and sending.

`core` methods are exposed at the top level of `api`. The 3 high level methods are:

1. `claimGas`
2. `sendAsset`
3. `doInvoke`

```js
import Neon from '@cityofzion/neon-js'
const config = {
  net: 'TestNet'
  address: 'ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW',
  privateKey: '7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344'
}
Neon.api.claimGas(config)
.then((conf) => {
  console.log(conf.response)
})

import {api} from '@cityofzion/neon-js'
api.claimGas(config)
.then((conf) => {
  console.log(conf.response)
})
```

These methods are the core functionality that `neon-js` will maintain. There is in built API selection that will choose the more reliable API between neonDB and neoscan based on past transactions.

The methods revolve around passing an configuration object containing all information down the chain. Each method digests the necessary information within the configuration object to perform its task and pass down the configuration object with new information added to it.

```js
import {api} from '@cityofzion/neon-js'
// This chain is basically api.claimGas
api.getClaimsFrom(config, api.neonDB)
.then((c) => api.createTx(c, 'claim'))
.then((c) => api.signTx(c))
.then((c) => api.sendTx(c))
```

## NeonDB

The `neonDB` API is exposed as:

```js
import Neon from '@cityofzion/neon-js'
Neon.get.balance('TestNet', address)
Neon.do.claimAllGas('TestNet', privateKey)

import {api} from '@cityofzion/neon-js'
api.neonDB.getBalance('TestNet', address)
api.neonDB.doClaimAllGas('TestNet', privateKey)
```

The NeonDB API describes the API set exposed by [neon-wallet-db](https://github.com/CityOfZion/neon-wallet-db) as well as other convenient methods. The node is hosted by CityOfZion.

The API returns useful information that is not built into standard NEO nodes such as claimable transactions or spendable coins. These information are used to construct transactions.

For example, the `getBalance` method returns a list of spendable assets of a specific address. This is then used to construct a ContractTransaction.

## Neoscan

The `neoscan` API serves as a backup in case NeonDB fails. It is not exposed in semantic exports. Instead, use named exports:

```js
import {api} from '@cityofzion/neon-js'
api.neoscan.getBalance('TestNet', address)
api.neoscan.getClaims('MainNet', address)
```

The methods found here are similar to NeonDB. Methods will return similar data structures to what is expected from NeonDB.

## CoinMarketCap

A straightforward call to CoinMarketCap API to retrieve the latest price information. This is exposed as `cmc` within `api`.

```js
import Neon from '@cityofzion/neon-js'
Neon.get.price('NEO', 'EUR')
Neon.get.price('GAS') // defaults to USD
Neon.get.prices(['NEO', 'GAS'], 'EUR')
Neon.get.prices(['NEO', 'GAS']) // defaults to USD

import { api } from '@cityofzion/neon-js'
api.cmc.getPrice('NEO', 'SGD')
api.cmc.getPrices(['NEO', 'GAS'], 'SGD')
```

## NEP5

The NEP5 Standard describes a set of methods to implement as a token in a smart contract. This is the NEO equivalent of the ERC-20 token standard in Ethereum.

This set of methods rely on the NEO node having version >= 2.3.3. The method uses `DEFAULT_RPC` found in constants as the default node.

```js
import Neon from '@cityofzion/neon-js'
const rpxScriptHash = Neon.CONST.CONTRACTS.TEST_RPX
Neon.get.tokenInfo('http://seed1.neo.org:20332', rpxScriptHash)
Neon.get.tokenBalance('http://seed1.neo.org:20332', rpxScriptHash, address)

import { api } from '@cityofzion/neon-js'
api.nep5.getTokenInfo('http://seed1.neo.org:20332', rpxScriptHash)
api.nep5.getTokenBalance('http://seed1.neo.org:20332', rpxScriptHash)
// This is a combination of both info and balance within a single call
api.nep5.getToken('http://seed1.neo.org:20332', rpxScriptHash, address)
```
