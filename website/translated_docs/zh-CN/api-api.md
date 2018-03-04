---
id: api-api
title: API
---

该 API 模块显示为：

```js
import Neon from '@cityofzion/neon-js'
Neon.get.balance('TestNet', address)
Neon.get.tokenBalance(contractScriptHash)

import {api} from '@cityofzion/neon-js'
api.neonDB.getBalance('TestNet', address)
api.cmc.getPrice()
api.sendAsset(config)
```

该api模块包含所有与Neon一起使用的第三方API。主要亮点是提供必要的信息来构建ClaimTransaction或ContractTransaction的NeonDB API。一个正常的NEO节点不能为我们提供通过RPC检索余额或可提取（claimable）交易的简便方法。

但是请未必注意，这些API依赖于由第三方托管的节点，因此使用它们需要您自担风险。

This module is structured slightly different from the rest of the modules. While the rest of the modules are flat in terms of hierachy, this module is composed of largely many other submodules. Only the core methods are found at the top level of the module.

## 核心方法

这些核心方法有助于捆绑不同的第三方API，以简化交易创建和发送。

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

这些方法是 `neon-js` 将要维护的核心功能。有内置的API选择，它将基于过去的交易在 neonDB 和 neoscan 之间选择更可靠的API。

这些方法围绕着传递一个包含沿着链的所有信息的配置对象。每种方法都会消化配置对象中的必要信息以执行其任务，并向其传递添加了新信息的配置对象。

```js
import {api} from '@cityofzion/neon-js'
// This chain is basically api.claimGas
api.getClaimsFrom(config, api.neonDB)
.then((c) => api.createTx(c, 'claim'))
.then((c) => api.signTx(c))
.then((c) => api.sendTx(c))
```

## NeonDB

`neonDB` API 暴露如下：

```js
import Neon from '@cityofzion/neon-js'
Neon.get.balance('TestNet', address)
Neon.do.claimAllGas('TestNet', privateKey)

import {api} from '@cityofzion/neon-js'
api.neonDB.getBalance('TestNet', address)
api.neonDB.doClaimAllGas('TestNet', privateKey)
```

NeonDB API 描述了由 [neon-wallet-db](https://github.com/CityOfZion/neon-wallet-db) 公开的API集合以及其它方便的方法。该节点由 CityOfZion 托管。

该 API 返回有用的信息，这些信息并非内置于标准的 NEO 节点，例如 Claimable 的交易或可花费的币。这些信息被用来构建交易。

例如，该 `getBalance` 方法返回某个具体地址的可花费资产的列表。然后这被用来构造一个ContractTransaction。

## Neoscan

`neoscan` API 作为一旦NeonDB失败时的备份。它没有暴露在语义导出中。而是使用命名的导出：

```js
import {api} from '@cityofzion/neon-js'
api.neoscan.getBalance('TestNet', address)
api.neoscan.getClaims('MainNet', address)
```

这里找到的方法类似于NeonDB。方法将返回 NeonDB 的预期的类似的数据结构。

## CoinMarketCap

直接调用 CoinMarketCap API来检索最新的价格信息。这是在 `api` 内暴露为 `cmc` 。

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

NEP5标准描述了一组在智能合约中作为令牌实施的方法。这是以太坊中ERC-20标记标准的NEO等效物。

这组方法依赖于版本 >= 2.3.3 的NEO节点。该方法使用常量中 `DEFAULT_RPC` 的默认节点。

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
