---
id: claimgas
title: Basic - Claiming Gas
---

This is a basic tutorial to claim gas using the `claimGas` method. If you have
read `Basic - Sending Assets`, then this should feel familiar. The process is
similar and is even easier.

> NOTE: This does not automatically send your NEO to yourself. It is merely
> performing the claim action for any claimable GAS.

```js
// import Neon, { api, wallet } from "@cityofzion/neon-js";
const { default: Neon, api, wallet } = require("@cityofzion/neon-js");

const claimingPrivateKey =
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69";
const network = "TestNet";
```

## Selecting the API provider and network

Like in `sendAsset`, we establish the network we are interacting with through
the selection of a API provider.

```js
const apiProvider = new api.neoscan.instance("TestNet");

console.log("\n\n--- API Provider ---");
console.log(apiProvider);
```

## Creating the Account

Similar to `sendAsset`, we are using an Account object to encapsulate our
private key.

This account will be the account to claim gas from.

```js
const account = new wallet.Account(claimingPrivateKey);

console.log("\n\n--- Claiming Address ---");
console.log(account);
```

## Execute

We assemble the config object and claimGas will do the following:

1. Retrieve the claims of claimingPrivateKey from apiProvider.
2. Retrieve a good rpc url from apiProvider.
3. Assemble the transaction using the claims.
4. Sign the transaction using the claimingPrivateKey
5. Submit the transaction to the network using the `sendrawtransaction` RPC call
   to the rpc url.

```js
const config = {
  api: apiProvider,
  account: account,
};

Neon.claimGas(config)
  .then((config) => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
  })
  .catch((config) => {
    console.log(config);
  });
```

## Notes

While it is possible to claim gas and send it to another address, this method
assumes that you are claiming it and sending it to the same address.
