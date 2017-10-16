********
Node RPC
********

The RPC module is exposed as::

  import Neon from 'neon-js'
  const client = Neon.create.rpcClient(URL)

  import {rpc} from 'neon-js'
  const client = new rpc.rpcClient(URL)


RPC Client
==========
The RPC Client acts as a model for a specific NEO Node. RPC Calls are methods which external applications can interact with the NEO network easily without sending a transaction.

It provides built-in RPC methods for easy calling.

RPC methods mirror the API reference found in the official NEO documentation. All RPC methods return a Promise.

Do note that method names follow the JS convention of camelCase instead of all lowercase.

::

  import Neon from 'neon-js'
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

Query
=====
A Query object is a simple wrapper around a request/response pair. It allows us to generate queries quickly without being dependent on a client.

Custom queries can be created by passing in the necessary parameters.

There are also static methods to support generating supported RPC methods.

::

  import Neon, {rpc} from 'neon-js'

  // Custom query
  const query = Neon.create.query({method: 'newmethod', params: [arg1, arg2]})
  const response = query.execute('http://mycustomneonode.com:10332')

  // Simple query creation
  const response = rpc.Query.getBlock(1).execute('http://seed1.neo.org:10332')

