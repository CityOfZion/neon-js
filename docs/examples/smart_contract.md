---
id: smart_contract
title: Smart Contract
---

## Using Neon API to invoke contract

```javascript
const sb = Neon.create.scriptBuilder();
// fill your contract script hash, function name and parameters
sb.emitAppCall("80de34fbe3e6488ce316b722c5455387b001df31", "name");
 
// Returns a hexstring
const script = sb.str;
console.log(script);
 
const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  url: "http://localhost:30333",
  account: account1, // The sending Account
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



## Using NEO-Scan API to invoke contract

```javascript
// fill your contract script hash, function name and parameters
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "name",
  args: []
};
 
const script = Neon.create.script(props);
 
// create transaction using NEO-Scan API
async function createTxByNeoScan() {
  let balance = await apiProvider.getBalance(account1.address);
  let transaction = new tx.InvocationTransaction({
    script: script,
    gas: 0
  });
 
  transaction.addAttribute(
    tx.TxAttrUsage.Script,
    u.reverseHex(wallet.getScriptHashFromAddress(account1.address))
  );
 
  transaction.calculate(balance).sign(account1.privateKey);
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



## Invoking Contract by constructing invocation transaction

```javascript
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
  u.reverseHex(wallet.getScriptHashFromAddress(account1.address))
);
 
// sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  account1.privateKey
);
 
// add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, account1.publicKey)
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



## Local Invocation(Will not send to the NEO blockchain)

```javascript
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

## Extract NEO/GAS From a Contract

```javascript
const neoAssetId =
  "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const gasAssetId =
  "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
 
// the unspent tx from contract
const inputObj = {
  prevHash: "95cfeed6a101babe5df8903c72952b59e239880f3be41ab2a65fb8269284765d",
  prevIndex: 0
};
 
// output to owner
const outPutObj = {
  assetId: neoAssetId,
  value: "100",
  scriptHash: ownerAccount.scriptHash
};
 
// create raw transaction
let rawTransaction = new tx.ContractTransaction();
 
rawTransaction.addAttribute(
  tx.TxAttrUsage.Script,
  u.reverseHex(wallet.getScriptHashFromAddress(ownerAccount.address))
);
 
rawTransaction.inputs[0] = new tx.TransactionInput(inputObj);
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj));
 
// build invocationScript
// String, Array
const sb = Neon.create.scriptBuilder();
sb.emitPush(2);
sb.emitPush(u.str2hexstring("haha"));
 
let witnessObj = {
  invocationScript: sb.str,
  verificationScript: ""
};
let witness = new tx.Witness(witnessObj);
witness.scriptHash = "f3418e5385d450fe7c2126a6e2943";
 
rawTransaction.addWitness(witness);
 
// sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  ownerAccount.privateKey
);
 
// add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, ownerAccount.publicKey)
);
 
// send raw transaction
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

