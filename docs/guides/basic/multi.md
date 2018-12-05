---
id: multi
title: Basic - Signing with a multi-sig account
---

This tutorial aims to show how to sign with a multi-sig account. This will be done by sending some assets from a multi-sig account.

A multi-sig Account can be identified by its verification script. It uses the `CHECKMULTISIG` OpCode (`ae` in hexstring). Thus, if you see any verification scripts ending with `ae`, it is likely to be a multi-sig Account.

## Setup
Here I will assume that you have already sent some assets over to the multi-sig account.

```js
const { default: Neon, api, wallet, tx, rpc } = require("@cityofzion/neon-js");

const neoscan = new api.neoscan.instance(
  "https://neoscan-testnet.io/api/main_net"
);
const rpcNodeUrl = "http://seed2.neo.org:20332";
```

Our multi-sig account in this example is made up of 3 keys with a signing threshold of 2.
Do note that the order of keys in the array matters. A different order will generate a totally different address.


```js
const keyA = new wallet.Account(
  "7d128a6d096f0c14c3a25a2b0c41cf79661bfcb4a8cc95aaaea28bde4d732344"
);
const keyB = new wallet.Account(
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69"
);
const keyC = new wallet.Account(
  "3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b"
);

const multisigAcct = wallet.Account.createMultiSig(2, [
  keyA.publicKey,
  keyB.publicKey,
  keyC.publicKey
]);

console.log("\n\n--- Multi-sig ---");
console.log(`My multi-sig address is ${multisigAcct.address}`);
console.log(`My multi-sig verificationScript is ${multisigAcct.contract.script}`);
```

## Construct Transaction
Similar to how we setup a transaction for a normal account transfer, we also do the same for our transfer from a multi-sig account.


```js
var constructTx = neoscan.getBalance(multisigAcct.address).then(balance => {
  const transaction = Neon.create
    .contractTx()
    .addIntent("NEO", 1, keyA.address)
    .addIntent("GAS", 0.00000001, keyB.address)
    .calculate(balance);

  return transaction;
});
```

## Sign Transaction
The only difference is in the signing of transactions. We need to sign the transaction individually by each key first. Then, we combine the signatures together to form a multi-sig witness. We should only see 1 witness attached to the transaction.


```js
const signTx = constructTx.then(transaction => {
  const txHex = transaction.serialize(false);

  // This can be any 2 out of the 3 keys.
  const sig1 = wallet.sign(txHex, keyB.privateKey);
  const sig2 = wallet.sign(txHex, keyC.privateKey);

  const multiSigWitness = tx.Witness.buildMultiSig(
    txHex,
    [sig1, sig2],
    multisigAcct
  );

  transaction.addWitness(multiSigWitness);

  console.log("\n\n--- Transaction ---");
  console.log(JSON.stringify(transaction.export(), undefined, 2));

  console.log("\n\n--- Transaction hash---");
  console.log(transaction.hash)

  console.log("\n\n--- Transaction string ---")
  console.log(transaction.serialize(true));
  return transaction;
});
```

## Send Transaction
We send off the transaction using sendrawtransaction RPC call like any other normal transaction.


```js
const sendTx = signTx
  .then(transaction => {
    const client = new rpc.RPCClient(rpcNodeUrl);
    return client.sendRawTransaction(transaction.serialize(true));
  })
  .then(res => {
    console.log("\n\n--- Response ---");
    console.log(res);
  })
  .catch(err => console.log(err));
```
