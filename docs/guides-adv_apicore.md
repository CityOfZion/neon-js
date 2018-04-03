---
id: adv_apicore
title: Advanced - API Core Components
---

In this guide, we will discuss the features of the 3 managed functions, the processes and the features used at each step.

The 3 managed methods are:

- sendAsset
- claimGas
- doInvoke

They represent the 3 major functions available to the NEO network at the moment. Each method basically takes in a configuration object and attempts to create and send a transaction based on the configuration provided. These methods are maintained by `neon-js` and act as a simple beginner template for people to start sending transactions.

All 3 methods follow a similar flow with minor differences based on their requirements. The methods accept a configuration object and return the same configuration object at the end. Do note that the methods mutate the configuration object passed in and thus the objects are not reusable.

These are the available properties for a configuration object:

```ts
export interface apiConfig {
  net: string // Network name or a url for 3rd party provider
  account?: Account // This can replace address and privateKey
  address?: string
  privateKey?: string
  publicKey?: string
  signingFunction?: signingFunction // Optional signing function.
  url?: string // Optional. If present, overrides the url of the NEO node used
  balance?: Balance // Optional. If present, this balance is used instead of retrieving a new one
  intents?: TransactionOutput[]
  sendingFromSmartContract?: boolean // This is used only if you are sending as a smart contract
  claims?: Claims // Only used for claimGas
  script?: string // Only used for doInvoke
  gas?: number // Only used for doInvoke
  override?: object // Transaction overrides
}
```

## Information Retrieval

This is the first step of every method. Based on the properties `net` and `address` provided, `neon-js` will attempt to retrieve the required information in order to construct the transaction.

`net` represents the network which `neon-js` will attempt to work on. Usual terms provided are `MainNet` or `TestNet` which are networks hard-coded within the SDK itself. If you are using a private network, you will need to add a new network in settings or provide the direct url of your 3rd party provider here (NeonDB or neoscan).

`address` is the address of the account that you wish to send from. This is the address from which the assets originate from. This field is used to query your balance or claims from the 3rd party provider.

Once the information is retrieved, it is appended to the configuration object under properties like `url`, `balance`, etc. and passed onto the next step.

You may override any of these retrievals by populating the properties first. For example, if you wish to direct your calls to a specific NEO node, you should populate `url` with your intended url.

## Transaction Building

The `intents` property is used to specify the outputs of the transaction. Do note that the actual outputs will be a superset of the `intents` object due to leftover change when calculating.

The `override` object is passed in to override any transaction properties after building the transaction.

The information in the object is passed into the transaction building call and the built transaction is appended to the configuration under the property `tx`.

## Transaction Signing

For signing, the property `privateKey` from the configuration object is used to sign the object. An alternative to this is to provide a signing function under the property `signingFunction`.

Instead of sending a user's private key to the config object, we can send the public key and a function that will sign the transaction.
This function, the signingFunction, will receive the transaction and public key as parameters. Now, we can provide logic that retrieves the private key from our user - using the public key to do so - and signs the transaction when we retrieve the key.

This the current way `neon-js` interacts with the Ledger Nano S for signing transactions.

> Do note that the signing function has to return a Promise!

```js
import Neon from '@cityofzion/neon-js';

function signTx(tx, publicKey) {
  // Sign tx and attach signature onto tx
  // The publicKey passed in is used as a check to ensure that the private and public keys match.

  return new Promise(resolve =>
    resolve(Neon.sign(tx, privateKey))
  );
}

const config = {
  net: "http://localhost:5000",
  script: Neon.create.script({
    scriptHash: '5b7074e873973a6ed3708862f219a6fbf4d1c411',
    operation: 'balanceOf',
    args: [Neon.u.reverseHex('cef0c0fdcfe7838eff6ff104f9cdec2922297537')]
  }),
  address: account.address,
  publicKey: account.publicKey,
  signingFunction: signTx
  gas: 1
}

Neon.doInvoke(config).then(res => {
  console.log(res);
});
```

## Broadcasting

In the information retrieval step, the configuration object is populated with the property `url`. This is the url of the NEO node that is used in this step. A RPC call is constructed at this step and sent to the `url` and the result appended to the configuration object as `response`.
