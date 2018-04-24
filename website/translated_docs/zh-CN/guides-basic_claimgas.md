---
id: basic_claimgas
title: Basic - Claiming Gas
---

This is a basic tutorial to claim gas using the `claimGas` method. If you have read `Basic - Sending Assets`, then this should feel familiar. The process is similar and is even easier.

> NOTE: This does not automatically send your NEO to yourself. It is merely performing the claim action for any claimable GAS.

## Setup configuration object

The `claimGas` method accepts a configuration object which contains the necessary information for it to do its job.

```js
import Neon from '@cityofzion/neon-js'

const config = {
  net: 'TestNet',  // The network to perform the action, MainNet or TestNet.
  address: 'ALfnhLg7rUyL6Jr98bzzoxz5J7m64fbR4s',
  privateKey: '9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69'
}
```

## Execute

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

##Notes

- The `claimGas` method is found under the `api` module for named imports.
- While it is possible to claim gas and send it to another address, this method assumes that you are claiming it and sending it to the same address.
