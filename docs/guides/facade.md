---
id: facade
title: Using the NetworkFacade
---

The NetworkFacade class is designed to be the quick and easy way to start using
neon-js without much configuration. The primary aim of the facade is to provide
single "batteries included" methods that developers can rely on to quickly build
out an interaction.

For this tutorial, you will need:

- A url which is a NEO node JSON RPC endpoint.
- A private key which contains funds.
- An address to send some funds to.

> While we highly recommend using a private network for development, if you wish to use the TestNet and are looking
> for a public RPC node you can try one from https://dora.coz.io/monitor

# Setup

First, we initialize the `NetworkFacade` pointing to our endpoint. Note that the
method call returns a promise. During initialization, the class will make an API
call to the endpoint to grab some basic details that we will use later.


```js
import Neon from "@cityofzion/neon-js";

const url = "http://localhost:20332";
const privateKey = "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g";
const address = "NMBfzaEq2c5zodiNbLPoohVENARMbJim1r";

const facadePromise = Neon.api.NetworkFacade.fromConfig({
  node: url,
});
```

# Create intent

Let us craft an intent to send some funds. The `decimalAmt` field allows us to
use the numbers that non-technical users are used to. In this example, an
alternative would be filling up the `integerAmt` field with `1`.

```js
const intent = {
  from: new Neon.wallet.Account(privateKey),
  to: address,
  decimalAmt: 0.00000001,
  contractHash: Neon.CONST.NATIVE_CONTRACT_HASH.GasToken,
};
```

We will also need to create a siging configuration to tell the class how to sign
the transaction. In this example, we will use a private key.


```js
const signingConfig = {
  signingCallback: Neon.api.signWithAccount(
    new Neon.wallet.Account(privateKey)
  ),
};
```

# Execute

The facade will take care of all the details such as setting an appropriate
validUntilBlock, filling in the minimum GAS fees required and sending it off.


```js
facadePromise
  .then((facade) => facade.transferToken([intent], signingConfig))
  .then((txid) => console.log(txid))
  .catch((err) => console.log(err));
```
