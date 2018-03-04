---
id: api-sc
title: 智能合约
---

该智能合约模块暴露为:

```js
import Neon from '@cityofzion/neon-js'
const sb = Neon.create.scriptBuilder()

import {sc} from '@cityofzion/neon-js'
const sb = new sc.scriptBuilder()
```

在NEO中，用户通过InvocationTransactions与智能合约交互。这些交易将scriptBuilder的十六进制输出和涉及到的资产携带到网络中进行处理。

要测试智能合约，最好使用RPC调用：

- `invoke`
- `invokefunction`
- `invokescript`

这些在 v2.3.3 中实现。这些RPC调用执行提供的脚本，并根据当前的区块链状态返回结果。但是，它并没有被记录在链上。因此，他们的目的是测试脚本，以确保有效性，并找出所需的gas成本。

例如，在NEP5令牌标准中，我们不要求实际的交易来检索令牌的名称或符号。因此，最好使用 `invoke` RPC 调用而不是实际的 InvocationTransaction。

当我们想要改变状态时，我们将使用一个交易。例如，我们希望将地址 A 的令牌传递给 B。我们将在发送实际交易之前使用 `invoke` 来确保脚本是有效的。

## Classes

### 脚本生成器

脚本生成器是一个对象，它将智能合约方法调用转换为一个可以用 InvocationTransaction 发送到网络的十六进制字符串。

```js
import Neon, {rpc} from '@cityofzion/neon-js'
const sb = Neon.create.scriptBuilder()
// Build script to call 'name' from contract at 5b7074e873973a6ed3708862f219a6fbf4d1c411
sb.emitAppCall('5b7074e873973a6ed3708862f219a6fbf4d1c411', 'name')

// Test the script with invokescript
rpc.Query.invokeScript(sb.str).execute(nodeURL)

// Create InvocationTransaction for real execution
const tx = Neon.create.invocationTx(publicKey, {}, {}, sb.str, 0)
```

您可以将多个调用链接在一个VM脚本中。结果将按顺序被返回。

```js
import Neon, {rpc} from '@cityofzion/neon-js'
const sb = Neon.create.scriptBuilder()
sb.emitAppCall(scriptHash, 'name')
.emitAppCall(scriptHash, 'symbol')

// Returns name, symbol
rpc.Query.invokeScript(sb.str)
  .execute(Neon.CONST.DEFAULT_RPC.MAIN)
  .then((res) => {
    console.log(res)
  })
```

为了方便，提供一个简单的包装方法。

```js
import Neon from '@cityofzion/neon-js'
const props = {
  scriptHash: Neon.CONST.CONTRACTS.TEST_RPX,
  operation: 'name',
  args: []
}
// Returns a hexstring
const vmScript = Neon.create.script(props)
```

### ContractParam

ContractParam 对象提供了一种构建 `invoke` 和 `invokefunction` 的简便方法。这些 RPC 调用使用一个 JSON 结构来进行参数传递，而且手工创建可能会混乱：

```js
  {
    type: String,
    value: 'this is a string'
  }
```

ContractParam 目前支持创建字符串，布尔值，整数，bytearray 和数组。

```js
import Neon, {sc, rpc, CONST} from '@cityofzion/neon-js'
const param1 = Neon.create.contractParam('String', 'balanceOf')
// This is a convenient way to convert an address to a reversed scriptHash that smart contracts use.
const param2 = sc.ContractParam.byteArray('AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx', 'address')

rpc.Query.invoke(CONST.CONTRACTS.TEST_RPX, param1, sc.ContractParam.array(param2))
  .then((res) => {
    console.log(res)
  })
```

ContractParams 与 ScriptBuilder 兼容，因此可以直接将它们作为参数传递。
