---
id: adv_invokeconcepts
title: Advanced - Additional doInvoke functions
---

In this guide, we will discuss features of `doInvoke` that seem a little more complex. We will add an extra transaction to our invoke with `intents` and externalize the signing of our transaction - so we don't have to pass a user's private key to the config.

## Intents - adding extra transactions
In the previous `doInvoke` guide, we sent 1 GAS alongside our invocation as a fee. As described [here](http://docs.neo.org/en-us/sc/systemfees.html#smart-contract-fees), transactions with a cost under 10 GAS are essentially free. Unfortunately we can't change the gas parameter of our configuration object to 0, since it has to be an integer value greater than 0.  

But there is a way to bypass this. We can add a transaction to ourselves as an intent, with a minimum amount of 0.00000001 GAS. This makes sure we don't have to send 1 GAS to our transaction (without that GAS being needed to consume the transaction), while making sure a transaction is registered and persisted to the blockchain.

The config object that `doInvoke` needs allows for a child object name intents. We set up our intents array as follows:
```js
const intents = [
  {
    assetId: assets.GAS,
    value: 0.00000001,
    scriptHash: Neon.get.scriptHashFromAddress(account.address)
  }
];

// Add to config
config.intents = intents;

Neon.doInvoke(config).then(res => {
  console.log(res);
})
```

## signingFunction

