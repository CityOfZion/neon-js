---
id: reading_data
title: Reading data from the blockchain
---

In this tutorial, we will be retrieving some data from the contracts in the blockchain.
We use this method to retrieve data for various purposes:

- Finding out the balance of an account.
- Calculating fees
- Finding out who to vote for.

This is done through the `invokefunction` or `invokescript` RPC call to a NEO node.
We will be performing a couple of invokes to show you how to retrieve contract data from the blockchain.

NOTE: This tutorial is written in Typescript. There
 

```js
import { rpc, sc, u } from "@cityofzion/neon-core";

const url = "http://localhost:20332";

const rpcClient = new rpc.RPCClient(url);
```

* Helper function to transform GAS integers into 8 decimal format.

```js
function transformGasDecimal(num) {
  if (num.length <= 8) {
    return "0." + num.padStart(8, "0");
  }
  const decimalPoint = num.length - 8;
  return (
    num.substring(0, decimalPoint) +
    "." +
    num.substring(decimalPoint, num.length)
  );
}
```

We will start off with finding out the total GAS supply on the blockchain currently.
 

```js
function getGasTotalSupply() {
  console.log("--- Current GAS total supply ---");
  // This is a hexstring
  const gasTotalSupplyScript = new sc.ScriptBuilder()
    .emitContractCall(sc.GasContract.INSTANCE.totalSupply())
    .build();

  //We wrap the script in a HexString class so the SDK can handle the conversion to Base64 for us.
  const payload = u.HexString.fromHex(gasTotalSupplyScript);
  return rpcClient.invokeScript(payload).then((gasTotalSupplyResult) => {
    const gasTotalSupply = gasTotalSupplyResult.stack[0].value;

    console.log(`Gas total supply is ${transformGasDecimal(gasTotalSupply)}`);
    console.log(
      `This action took ${transformGasDecimal(
        gasTotalSupplyResult.gasconsumed
      )} GAS to run.\n\n`
    );
  });
}
```

We know that the GAS supply is ever increasing with each block produced.
We can verify this by running the same exact script again after at least a block has passed.
For now, we want to check out the candidates available for voting on this chain.
This information is held in the NEO contract.
This time, we will try out the invokefunction RPC call.
 

```js
function getNeoCandidates() {
  console.log("--- Candidates and their votes ---");
  const neoCandidateContractCall = sc.NeoContract.INSTANCE.getCandidates();
  return rpcClient
    .invokeFunction(
      neoCandidateContractCall.scriptHash,
      neoCandidateContractCall.operation
    )
    .then((neoCandidateResult) => {
      const neoCandidatesStackItems = neoCandidateResult.stack[0].value;

      const neoCandidateStrings = neoCandidatesStackItems.map((i) => {
        const struct = i.value;
        const publicKey = u.HexString.fromBase64(struct[0].value).toBigEndian();
        const votes = parseInt(struct[1].value);
        return `${publicKey} has ${votes} votes\n`;
      });

      neoCandidateStrings.forEach((i) => console.log(i));

      console.log(
        `This action took: ${transformGasDecimal(
          neoCandidateResult.gasconsumed
        )} GAS to run.`
      );
      console.log("\n\n");
    });
}
```

One other important function that invokefunction/invokescript serves is to help us estimate the GAS required to execute the script.
As the node is actually executing the script within the blockchain context, the gasconsumed field is pretty accurate assuming that the signers field is populated correctly.
This is also how neon-js is able to assemble transactions with a good GAS fee estimate.

```js
getGasTotalSupply().then(getNeoCandidates);
```
