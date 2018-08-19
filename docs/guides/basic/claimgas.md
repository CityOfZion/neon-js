---
id: claimgas
title: Basic - Claiming Gas
---

This is a basic tutorial to claim gas using the `claimGas` method. If you have read `Basic - Sending Assets`, then this should feel familiar. The process is similar and is even easier.

> NOTE: This does not automatically send your NEO to yourself. It is merely performing the claim action for any claimable GAS.

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

## Setup configuration object

The `claimGas` method accepts a configuration object which contains the necessary information for it to do its job.

```js
import Neon from '@cityofzion/neon-js'

const config = {
  api: apiProvider,
  account: acct
}
```

## Send

```js
Neon.claimGas(config)
.then(config => {
  console.log(config.response)
})
.catch(config => {
  console.log(config)
})
```

`claimGas` automatically does all the work of retrieving claimable gas list, creating and signing the transaction and sending it to a NEO node. The `txid` is available in `config.response` if the transaction is successful.

## Notes

- The `claimGas` method is found under the `api` module for named imports.
- While it is possible to claim gas and send it to another address, this method assumes that you are claiming it and sending it to the same address.
