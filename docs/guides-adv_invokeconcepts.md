---
id: adv_invokeconcepts
title: Advanced - Additional doInvoke functions
---

In this guide, we will discuss features of `doInvoke` that seem a little more complex. We will add an extra transaction to our invoke with `intents` and externalize the signing of our transaction - so we don't have to pass a user's private key to the config.

## Intents - adding extra transactions
In the previous `doInvoke` guide, we sent 1 GAS alongside our invocation as a fee. As described [here](http://docs.neo.org/en-us/sc/systemfees.html#smart-contract-fees), transactions with a cost under 10 GAS are essentially free. 

So our `gas` field should stay 0 if your calculated fee remains below 10 GAS. You can determine this cost with an `invokeScript` RPC as we did [here](http://cityofzion.io/neon-js/docs/en/basic_createscript.html), evaluating the `gas_consumed` field in the response object.

There is a way to achieve this. We can add a transaction to ourselves as an intent, with a minimum amount of 0.00000001 GAS. This makes sure we don't have to send 1 GAS to our transaction (without that GAS being needed to consume the transaction), while making sure a transaction is registered and persisted to the blockchain.

The config object that `doInvoke` needs allows for a child object name intents. We set up our intents array as follows:
```js
import Neon, { CONST } from '@cityofzion/neon-js';

const intents = [
  {
    assetId: CONST.ASSET_ID.GAS,
    value: 0.00000001,
    scriptHash: Neon.get.scriptHashFromAddress(account.address)
  }
];

// Add to config
config.intents = intents;

Neon.doInvoke(config).then(res => {
  console.log(res);
});
```

## signingFunction
Right now we're adding a user's private key to the config object, which is sensitive information and should be handled carefully.  
One way to do so is to externalize the signing of the transaction in a separate function. Right now, `signingFunction` is already used to sign with the Ledger.

Instead of sending a user's private key to the config object, we can send the public key and a function that will sign the transaction.  
This function, the signingFunction, will receive the transaction and public key as parameters. Now, we can provide logic that retrieves the private key from our user - using the public key to do so - and signs the transaction when we retrieve the key.

> Do note that the signing function has to return a Promise!

```js
import Neon from '@cityofzion/neon-js';

function signTx(tx, publicKey) {
  // Create logic that gets the privateKey based on the publicKey
  const privateKey = getPrivateKey(publicKey);

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
