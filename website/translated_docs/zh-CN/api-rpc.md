---
id: api-rpc
title: RPC
---

该 RPC 模块暴露为：

```js
import Neon from '@cityofzion/neon-js'
const client = Neon.create.rpcClient(URL)

import {rpc} from '@cityofzion/neon-js'
const client = new rpc.rpcClient(URL)
```

## 类

### RPC客户端 (RPCClient)

RPC客户端充当特定 NEO 节点的模型。RPC调用是外部应用程序可以轻松地与NEO网络交互而不发送交易的方法。

它提供了内置的 RPC 方法以方便调用。以前的查询可以从 `history` 属性中检索。

RPC方法镜像官方 NEO 文档中的API参考。所有的RPC方法都返回一个 Promise。

请务必注意，方法名称遵循camelCase的JS约定，而不是全部小写。

```js
import Neon from '@cityofzion/neon-js'
// Creates a RPCClient with URL of version 2.3.2
const client = Neon.create.rpcClient('http://seed1.neo.org:10332', '2.3.2')
// Returns block number
client.getBlockCount()
client.getRawTransaction('f5412dba662ec8023e6fc93dba23e7b62679e0a7bebed52a0c3f70795cbb51d2', 1)

// This will throw an error as invokefunction is not supported @ 2.3.2
client.invokeFunction(contractAddr,'name')

// Custom query
let query = Neon.create.query({method: 'custommethod'}
client.execute(query)
```

### 查询

查询对象是一个围绕在请求/响应对周围的简单的包装。它使我们能够快速生成查询，而不依赖于客户端。

自定义查询可以通过传入必要的参数来创建。

还有支持生成受支持的RPC方法的静态方法。

```js
import Neon from '@cityofzion/neon-js'

// Custom query
const query = Neon.create.query({method: 'newmethod', params: [arg1, arg2]})
const response = query.execute('http://mycustomneonode.com:10332')

import { rpc } from '@cityofzion/neon-js'
// Simple query creation and execution
const response = rpc.Query.getBlock(1).execute('http://seed1.neo.org:10332')
```

### Network

The Network class is a configuration object that contains the information required to connect to a blockchain. The default networks avaialble in `neon-js` can be found in the global settings object. This class can be used to add support for a private network to `neon-js`.

```js
import Neon, { rpc } from '@cityofzion/neon-js'

const newNet = new rpc.Network({name: 'NewNet'})
Neon.add.network(newNet)

console.log(Neon.settings.networks['NewNet'])
```
