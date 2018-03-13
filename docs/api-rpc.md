---
id: api-rpc
title: RPC
---

The RPC module is exposed as:

```js
import Neon from '@cityofzion/neon-js'
const client = Neon.create.rpcClient(URL)

import { rpc } from '@cityofzion/neon-js'
const client = new rpc.rpcClient(URL)
```

## Classes

### RPCClient

The RPC Client acts as a model for a specific NEO Node. RPC Calls are methods which external applications can interact with the NEO network easily without sending a transaction.

It provides built-in RPC methods for easy calling. Previous queries can be retrieved from the `history` property.

RPC methods mirror the API reference found in the official NEO documentation. All RPC methods return a Promise.

Do note that method names follow the JS convention of camelCase instead of all lowercase.

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

### Query

A Query object is a simple wrapper around a request/response pair. It allows us to generate queries quickly without being dependent on a client.

Custom queries can be created by passing in the necessary parameters.

There are also static methods to support generating supported RPC methods.

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
