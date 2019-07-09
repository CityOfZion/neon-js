---
id: smart_contract
title: Smart Contract
---

> You can refer to **Precondition** part to check the initiation of `apiProvider`, `myWallet` and `myAccount`

## Invocation Transaction

### With Neon API (High Level)

```javascript
const { default: Neon, api } = require("@cityofzion/neon-js");

const sb = Neon.create.scriptBuilder();
// fill your contract script hash, function name and parameters
sb.emitAppCall("80de34fbe3e6488ce316b722c5455387b001df31", "name");
 
// Returns a hexstring
const script = sb.str;
console.log(script);
 
const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  url: "http://localhost:30333", // Optional if apiProvider is assigned
  account: myAccount, // The sending Account
  script: script, // The Smart Contract invocation script
  gas: 0, //This is additional gas paying to system fee.
  fees: 0 //Additional gas paying for network fee(prioritizing, oversize transaction).
};
 
// Neon API
Neon.doInvoke(config)
 .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
 })
 .catch(config => {
    console.log(config);
 });
```



### With NEO-Scan API (Low Level)

```javascript
const { default: Neon, tx, rpc, u } = require("@cityofzion/neon-js");

// fill your contract script hash, function name and parameters
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "name",
  args: []
};
 
const script = Neon.create.script(props);
 
// create transaction using NEO-Scan API
async function createTxByNeoScan() {
  let balance = await apiProvider.getBalance(myAccount.address);
  let transaction = new tx.InvocationTransaction({
    script: script,
    gas: 0
  });
 
  transaction.addAttribute(
    tx.TxAttrUsage.Script,
    u.reverseHex(wallet.getScriptHashFromAddress(myAccount.address))
  );
 
  transaction.calculate(balance).sign(myAccount.privateKey);
  return transaction;
}
 
// Send raw transaction
const client = new rpc.RPCClient("http://localhost:30333");
createTxByNeoScan().then(transaction => {
  client
    .sendRawTransaction(transaction)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
});
```



### Constructing Raw Transaction

This method is not recommended in neon-js.

```javascript
const { default: Neon, tx, wallet, rpc, u } = require("@cityofzion/neon-js");

const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "symbol",
  args: []
};
const script = Neon.create.script(props);
 
 
// create raw invocation transaction
let rawTransaction = new tx.InvocationTransaction({
  script: script,
  gas: 0
});
 
// build input objects and output objects.
rawTransaction.addAttribute(
  tx.TxAttrUsage.Script,
  u.reverseHex(wallet.getScriptHashFromAddress(myAccount.address))
);
 
// sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  myAccount.privateKey
);
 
// add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, myAccount.publicKey)
);
 
// Send raw transaction
const client = new rpc.RPCClient("http://localhost:30333");
client
  .sendRawTransaction(rawTransaction)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```



## Local Invocation

NOTE: This method will not send any transactions to the blockchain.

```javascript
const { default: Neon, rpc } = require("@cityofzion/neon-js");

const sb = Neon.create.scriptBuilder();
sb.emitAppCall("80de34fbe3e6488ce316b722c5455387b001df31", "name");
// Returns a hexstring
const script = sb.str;
 
// Using RPC Query to do local invocation
rpc.Query.invokeScript(script)
  .execute("http://localhost:30333")
  .then(res => {
    console.log(res.result);
  })
  .catch(config => {
    console.log(config);
  });
```