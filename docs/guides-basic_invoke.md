---
id: basic_invoke
title: Basic - Invoking a Smart Contract
---

In this tutorial you will learn the difference between a testinvoke - as used in the Create Smart Contract Script guide - and an actual invocation of a Smart Contract. You will learn to use the `doInvoke` function to persist your calls to the NEO Blockchain.

This guide will continue on the previous guide, using the old [ICO Template](https://github.com/neo-project/examples-csharp/blob/master/ICO_Template/ICO_Template.cs).

## testinvoke vs invocationTransaction
In the previous guide, we used `Neon.rpc.Query.invokeScript` as an RPC call to invoke our script. What we've actually done is use the equivalent of neo-python's `testinvoke`, to literally test whether our invocation was successful.

Unless we turn this into an `invocationTransaction` RPC call, this will not persist to the blockchain. To do this, the script will be turned into a transaction. This, in turn, has to be signed with the user's private key.

## doInvoke
Luckily, `doInvoke` handles this for us! It will configure our script as a transaction, sign it with our private key and ultimately send it via an `invocationTransaction` RPC call.

To use the `doInvoke` function, we need the following minimal ingredients:
* `net`: 'MainNet', 'TestNet' or a neon-wallet-db URL
* `script`: the VM script, as we created with `Neon.create.script`
* `address`: the NEO address of the user
* `privateKey`: the private key of the user
* `gas`: the gas fee we will attach to the transaction (this has to be greater than 0!)

This in turn will be stored in a configuration object
```js
const config = {
  net: "http://localhost:5000",
  script: Neon.create.script(props),
  address: account.address,
  privateKey: account.privateKey,
  gas: 1
}
```
and ultimately we call doInvoke as a promise:
```js
Neon.doInvoke(config).then(res => {
  console.log(res)
})
```
