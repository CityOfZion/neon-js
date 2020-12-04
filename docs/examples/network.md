---
id: network
title: Network
---

## Initiate MainNet/TestNet Instance

### With Neoscan API

```javascript
const { api } = require("@cityofzion/neon-js");

const NETWORK = "MainNet"; // or "TestNet"
const apiProvider = new api.neoscan.instance(
  "https://api.neoscan.io/api/main_net"
  //or "https://neoscan-testnet.io/api/test_net" for TestNet
);
```

### With NeoCli API

```javascript
const { api } = require("@cityofzion/neon-js");

const NETWORK = "MainNet"; // or "TestNet"
const apiCli = new api.neoCli.instance(
  "http://seed5.ngd.network:10332"
  //or "http://seed5.ngd.network:20332" for TestNet
);
```

### With Notifications API

```javascript
const { api } = require("@cityofzion/neon-js");

const notificationsProvider = new api.notifications.instance(
  "wss://main.YOUR_PUBSUB_SERVER.com/event"
);
```

## Initiate PrivateNet Instance

### Using Neoscan and notifications API

```javascript
const { default: Neon, rpc, api } = require("@cityofzion/neon-js");

const privateNetConfig = {
  name: "PrivateNet",
  nodes: [
    "neo-cli-privatenet-1:20333",
    "neo-cli-privatenet-2:20334",
    "neo-cli-privatenet-3:20335",
    "neo-cli-privatenet-4:20336"
  ], // Optional
  extra: {
    // Neoscan URL
    neoscan: "http://localhost:4000/api/main_net",
    // Notifications URL
    notifications: "ws://localhost:8080/event"
  }
};

// Add network config to neon-js
const privateNet = new rpc.Network(privateNetConfig);
Neon.add.network(privateNet, true);

// lookup an instance of PrivateNet neoscan
const apiProvider = new api.neoscan.instance("PrivateNet");
```

### Using RPC Client

```javascript
const { rpc } = require("@cityofzion/neon-js");

const nodeUrl = "http://rpc.url:portNum"; // RPC URL
const client = new rpc.RPCClient(nodeUrl);
```
