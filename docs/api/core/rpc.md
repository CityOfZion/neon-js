---
id: rpc
title: RPC
---

The `rpc` module is exposed as:

```js
import Neon, { rpc } from "@cityofzion/neon-js";
const client = Neon.create.rpcClient(URL);
const alternative = new rpc.rpcClient(URL);
```

This module contains the classes and interfaces to interact with the RPC endpoints supplied by the current C# neo implementation. It also contains the classes for `Network` and `Protocol` which are configurations that provide us details about a network.

---

## Classes

### RPCClient

The RPC Client acts as a model for a specific NEO Node. RPC Calls are methods which external applications can interact with the NEO network easily without sending a transaction.

It provides built-in RPC methods for easy calling. Previous queries can be retrieved from the `history` property.

RPC methods mirror the API reference found in the official NEO documentation. All RPC methods return a Promise.

Do note that method names follow the JS convention of camelCase instead of all lowercase.

```js
// Creates a RPCClient that will talk to http://seed1.neo.org:10332
const client = Neon.create.rpcClient("http://seed1.neo.org:10332");
const alternative = new rpc.RPCClient("http://seed1.neo.org:10332");

// Returns block number
client.getBlockCount();
client.getRawTransaction(
  "f5412dba662ec8023e6fc93dba23e7b62679e0a7bebed52a0c3f70795cbb51d2",
  1
);

// Custom query (used for methods not supported by implementation)
let query = Neon.create.query({ method: "custommethod" });
client.execute(query);
```

### Query

A Query object is a simple wrapper around a request/response pair. It allows us to generate queries quickly without being dependent on a client.

Custom queries can be created by passing in the necessary parameters.

There are also static methods to support generating supported RPC methods.

```js
// Custom query
const query = Neon.create.query({ method: "newmethod", params: [arg1, arg2] });
const response = query.execute("http://mycustomneonode.com:10332");

// Simple query creation and execution
const response = rpc.Query.getBlock(1).execute("http://seed1.neo.org:10332");
```

### Network

The Network class is a configuration object that contains the information required to connect to a blockchain. The default networks avaialble in `neon-js` can be found in the global settings object. This class can be used to add support for a private network to `neon-js`.

```js
const newNet = new rpc.Network({ name: "NewNet" });
Neon.add.network(newNet);

console.log(Neon.settings.networks["NewNet"]);
```

Access the fields in conventional javascript notation (camelCase):

```js
class Network {
  public name: string;
  public protocol: Protocol;
  public nodes: string[];
  public extra: { [key: string]: string };
}
```

However, this class will export as a JSON that follows the C# convention in order to maintain compatibility with the main implementation:

```ts
interface NetworkJSON {
  Name: string;
  ProtocolConfiguration: ProtocolJSON;
  Nodes: string[];
  ExtraConfiguration: { [key: string]: string };
}
```

Similarly, the constructor is compatible with the protocol files from C#. Once imported, proceed to follow javascript conventions.

```js
const javascriptStyle = new rpc.Network({ name: "camelCaseNet" });
const CSharpStyle = new rpc.Network({ Name: "PascalCaseNet" });

javascriptStyle.name; // camelCaseNet
CSharpStyle.name; //PascalCaseNet
```

### Protocol

The Protocol class is the interface and class representing the configuration of the network itself. Details such as the magic number, seedlist and validators are found in this class.

This class is not exposed in the fluent API.

Similar to the `Network` class, this class maintains C# compatibility for the constructor and `export()` method.

```js
const protocol = new rpc.Protocol({ magic: 23 });
const CSharpProtocol = new rpc.Protocol({ Magic: 23 });
```

The export interface is:

```ts
interface ProtocolJSON {
  Magic: number;
  AddressVersion: number;
  StandbyValidators: string[];
  SeedList: string[];
  SystemFee: { [key: string]: number };
}
```
