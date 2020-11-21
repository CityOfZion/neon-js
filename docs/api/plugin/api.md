---
id: api
title: api
---

The `api` module is available as the plugin `@cityofzion/neon-api`.

```js
import Neon, { api } from "@cityofzion/neon-js";
Neon.sendAsset(config);
Neon.claimGas(config);
Neon.doinvoke(config);

api.neoscan.getBalance("http://www.neoscan-testnet.io/test_net/v1/", address);
api.sendAsset(config);
```

The `api` module contains all 3rd party API that is useful together with Neon. A normal NEO node does not provide us with a convenient way of subscribing to smart contract events and retrieving the balance or claimable transactions through RPC. Thus, we rely on external services such as NeonDB, neoscan and notification servers for the information required.

However, do note that these APIs rely on hosted nodes by 3rd party and thus use them at your own risk.

This module is structured slightly different from the rest of the modules. While the rest of the modules are flat in terms of hierachy, this module is composed of largely many other submodules. Only the core methods are found at the top level of the module.

---

## Core

These are core methods that help to tie up the different 3rd party APIs in order to simplify transaction creation and sending.

There are 3 core methods that covers majority of the functionality that is required:

1. `claimGas`
2. `sendAsset`
3. `doInvoke`

They operate by taking in a configuration object which contains all the information necessary to request, construct and send a transaction. At the end, the same configuration object is returned and you may inspect the `response` property to check for the success of your transaction.

```js
const provider = new Neon.api.neoscan.instance('TestNet')
const config = {
  api: provider,
  account: new Neon.wallet.Account('MY_ADDRESS_PRIVATE_KEY')
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

## Building blocks

Under the hood, the core methods are actually a chain of functions strung together. These methods are also available in the package for your consumption if you have special needs outside of the 3 conventional methods.

```js
// This chain is basically api.claimGas
api
  .getClaimsFrom(config, api.neonDB)
  .then(c => api.createTx(c, "claim"))
  .then(c => api.signTx(c))
  .then(c => api.sendTx(c));
```

## Provider

Providers are external services that provide information that is not easily gathered from the RPC nodes. For example, to send NEO or GAS, we need to retrieve all the UTXO information associated with an address.

The available providers are `neoscan`, `neonDB` and `notifications`. The first two are interfaces that translate the different REST responses into uniform data structures that are used by other `neon-js` modules, while the `notifications` interface handles subscriptions to a live feed of events being triggered inside a smart contract.

```js
const mainNetNeoscan = new api.neocan.instance("MainNet");
const mainNetNeonDB = new api.neonDB.instance("MainNet");
const mainNetNotifications = new api.notifications.instance("wss://YOUR_PUBSUB_SERVER.com");

const neoscanBalance = await mainNetNeoscan.getBalance(addr);
const neonDBBalance = await mainNetNeonDB.getBalance(addr);

console.log(neoscanBalance.equals(neonDBBalance)); // They should be the same datastructure with the same information

const subscription = mainNetNotifications.subscribe("0x314b5aac1cdd01d10661b00886197f2194c3c89b", (event) => {
  console.log(event); // Print the events being received in real time
});

subscription.unsubscribe(); // Unsubscribe the previous subscription
```
