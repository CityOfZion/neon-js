---
id: sendasset
title: Basic - Sending assets
---

This is a basic tutorial to send assets using the `sendAsset` method.

`neon-js` provides out-of-the-box functionality for sending assets, claiming gas and invoking smart contracts. In this tutorial, I will be demostrating how to use the high level functions to send some native assets.

For clarification, when we talk about assets, we are referring to native assets such as NEO or GAS. NEP5 tokens are not considered assets as they are records within smart contracts. Thus, this is not applicable for sending those tokens.

## Creating the Intent

To send an asset, we first have to create an `Intent`. This intent is represents the instructions to send assets to a specific address.

```js
import Neon, { api, wallet } from "@cityofzion/neon-js";

// We want to send 1 NEO and 1 GAS to ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
const intent = api.makeIntent(
  { NEO: 1, GAS: 1 },
  "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW"
);
console.log(intent); // This is an array of 2 Intent objects, one for each asset
```

To add more intents, simply use the `api.makeIntent` to create them and concatenate them together in a single array.

## Selecting the API Provider

We need to decide which provider shall we use. In this example, I shall be using `TestNet` with neoscan. As `TestNet` is built into the `neon-js` networks, we can retrieve it using its name `TestNet` instead of stating a url.

```js
// This initializes the instance with url from settings.networks.TestNet
const apiProvider = new api.neoscan.instance("TestNet");
```

## Create Account object

We create an `Account` object to store our credentials. In this example, we are using a private key to create the account because we are also signing with the same private key. However, if you wish to use an external signing function (such as a ledger), you can create the account with an address and provide the signing function instead.

This account will be the account where the assets will come from.

```js
const acct = new wallet.Account(
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69"
);
```

## Setup the configuration object

`sendAsset` accepts an configuration object that contains all the necessary details to construct the transaction.

```js
const config = {
  api: apiProvider, // The network to perform the action, MainNet or TestNet.
  account: acct, // This is the address which the assets come from.
  intents: intent // This is where you want to send assets to.
};
```

## Send

```js
Neon.sendAsset(config)
  .then(config => {
    console.log(config.response);
  })
  .catch(config => {
    console.log(config);
  });
```

`sendAsset` automatically does all the work in retrieving the balance, constructing the transaction, signing it and sending it off to the optimal node. When this is done, the promise returns the `config` object. The object is the same object passed in at the beginning with all the additional information used in the process appended to it. For example, the `url` field is the NEO node that sent the transaction to.

Here, we are interested in the `response` property, which contains the response from the RPC endpoint upon sending the transaction.

```js
{
  result: true,
  txid: '3be60dd2b3ce44d4e84f17519d0afce6372e269aafb9598e5b7be8230f6b6380'
}
```

If the transaction is successful, the `txid` is attached in the response. We can take this string and use it in a block explorer to check out our transaction.
