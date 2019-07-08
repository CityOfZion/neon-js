---
id: first
title: Network
---

## Connect to the MainNet

### Using NEO-Scan API

```javascript
const { default: Neon, rpc, api, wallet, tx, sc, u } = require("@cityofzion/neon-js");

// Connect to the NEO MainNet
const network = "MainNet";
const apiProvider = new api.neoscan.instance(
    // NEO-Scan API URL
  "https://api.neoscan.io/api/main_net"
);
```



### Using NeoCli API

```javascript
const { default: Neon, rpc, api, wallet, tx, sc, u } = require("@cityofzion/neon-js");

// Connect to the NEO MainNet
const network = "TestNet";
const apiCli = new api.neoCli.instance(
  	// RPC node on main net
  "http://seed5.ngd.network:10332"
);
```



## Connect to the TestNet

### Using NEO-Scan API

```javascript
const { default: Neon, rpc, api, wallet, tx, sc, u } = require("@cityofzion/neon-js");

// Connect to the NEO TestNet
const network = "TestNet";
const apiProvider = new api.neoscan.instance(
    // NEO-Scan API URL
  "https://neoscan-testnet.io/api/test_net"
);
```



### Using NeoCli API

```javascript
const { default: Neon, rpc, api, wallet, tx, sc, u } = require("@cityofzion/neon-js");

// Connect to the NEO TestNet
const network = "TestNet";
const apiCli = new api.neoCli.instance(
  // RPC node on test net
  "http://seed5.ngd.network:20332"
);
```





## Connect to the neo-local PrivateNet

### Using NEO-Scan API

```javascript
const { default: Neon, rpc, api, wallet, tx, sc, u } = require("@cityofzion/neon-js");
 
// Connect to neo-local network
const privateNetConfig = {
  name: "PrivateNet",
  nodes: [
    "neo-cli-privatenet-1:20333",
    "neo-cli-privatenet-2:20334",
    "neo-cli-privatenet-3:20335",
    "neo-cli-privatenet-4:20336"
 ],
  extra: {
    neoscan: "http://localhost:4000/api/main_net"
 }
};
 
// Add network config to neon-js
const privateNet = new rpc.Network(privateNetConfig);
Neon.add.network(privateNet, true);
 
// You will be able to lookup an instance of PrivateNet neoscan
const apiProvider = new api.neoscan.instance("PrivateNet");
```



### Using RPC Client

```javascript
const nodeUrl = "http://localhost:30333"
const rpcClient = new rpc.RPCClient(nodeUrl);
```

