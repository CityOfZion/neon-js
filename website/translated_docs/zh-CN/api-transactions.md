---
id: api-transactions
title: 交易
---

交易模块暴露为：

```js
import Neon from '@cityofzion/neon-js'
let transaction1 = Neon.create.claimTx(...args)
transaction1 = Neon.sign.transaction(transaction1, privateKey)
let serialized1 = Neon.serialize.tx(transaction1)
let txid1 = Neon.get.transactionHash(transaction1)

import {tx} from '@cityofzion/neon-js'
let transaction2 = tx.createClaimTx(...args)
transaction2 = tx.signTransaction(transaction2, privateKey)
let serialized2 = tx.serializeTransaction(transaction2)
let txid2 = tx.getTransactionHash(transaction2)
```

交易形成了与区块链交互的核心。为了在链上实现任何状态变化，交易需要由共识节点发送并处理成块。

## 类

### 交易

Transaction类是一个包装类，它包含操作和构建交易所需的所有工具。这允许我们动态地添加意图，随意地评论，而不是将所有东西都塞进一个单一的方法中。

```js
import Neon from '@cityofzion/neon-js'
// Let us create a ContractTransaction
let tx = Neon.create.tx({type: 128})
// Now let us add an intention to send 1 NEO to someone
tx
.addOutput('NEO',1,someAddress)
.addRemark('I am sending 1 NEO to someAddress') // Add an remark
.calculate(balance) // Now we add in the balance we retrieve from an external API and calculate the required inputs.
.sign(privateKey) // Sign with the private key of the balance

const hash = tx.hash // Store the hash so we can use it to query a block explorer.

// Now we can use this serializedTx string and send it through sendrawtransaction RPC call.
const serializedTx = tx.serialize()
```

### 交易组件

交易由以下部分组成：

1. 类型

这决定了交易类型。这决定了交易如何被序列化或反序列化。目前该库仅支持以下几种类型：

  1.	Contract合约
  2.	Claim提取
  3.	Invocation调用

2. 版本

这决定了交易的版本。版本不同，协议可能延迟。

3. 属性

4. 输入

交易的输入。这是这笔交易正在“花费”的资产。系统费用也包括在这里。交易处理后，输入被视为“花费”。

5. 输出

交易的输出。这表示由此交易创建的未花费资产。这些产出是“未花费”的，可以在未来的交易中作为输入参考。

6. 见证人

交易的见证人。这些是授权交易的签名。通常使用输入资产所有者的私钥来生成签名。请务必注意，虽然这个组件是被命名的 `Witness`，但它在 `Transaction` 对象中的关键是 `scripts`（我们试图保持C＃回购中描述的原始名称）。

7. 独占数据（每种交易类型都是唯一的）

各项交易所需的各种数据。例如，ClaimTransaction 将具有 `claims` 包含所有可提取的（claimable）交易的字段。 InvocationTransaction 将具有该 `script` 字段来代替智能合同调用。
