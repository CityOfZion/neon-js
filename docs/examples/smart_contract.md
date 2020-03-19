---
id: smart_contract
title: Smart Contract
---

> You can refer to **Precondition** part to check the initiation of `apiProvider`, `myWallet` and `myAccount`

## Invocation Transaction

### High Level

```javascript
const { default: Neon, api } = require("@cityofzion/neon-js");

const sb = Neon.create.scriptBuilder();
// Your contract script hash, function name and parameters
sb.emitAppCall("80de34fbe3e6488ce316b722c5455387b001df31", "name");

// Returns a hexstring
const script = sb.str;
console.log(script);

const config = {
  api: apiProvider, // Network
  url: "http://rpc.url:portNum", // RPC URL
  account: myAccount, // Your Account
  script: script, // The Smart Contract invocation script
  gas: 0, // Optional, system fee
  fees: 0 // Optional, network fee
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

### Low Level

```javascript
const { default: Neon, tx, rpc, u } = require("@cityofzion/neon-js");

// Your contract script hash, function name and parameters
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "name",
  args: []
};

const script = Neon.create.script(props);

// Create transaction using Neoscan API
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
const client = new rpc.RPCClient("http://rpc.url:portNum");
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

### Raw Level

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

// Build input objects and output objects.
rawTransaction.addAttribute(
  tx.TxAttrUsage.Script,
  u.reverseHex(wallet.getScriptHashFromAddress(myAccount.address))
);

// Sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  myAccount.privateKey
);

// Add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, myAccount.publicKey)
);

// Send raw transaction
const client = new rpc.RPCClient("http://rpc.url:portNum");
client
  .sendRawTransaction(rawTransaction)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

## Read Invoke - No Transaction Broadcast

> NOTE: This method will not send any transactions to the blockchain.

```javascript
const { default: Neon, rpc } = require("@cityofzion/neon-js");

const sb = Neon.create.scriptBuilder();
sb.emitAppCall("80de34fbe3e6488ce316b722c5455387b001df31", "name");
// Returns a hexstring
const script = sb.str;

// Using RPC Query to do local invocation
rpc.Query.invokeScript(script)
  .execute("http://rpc.url:portNum")
  .then(res => {
    console.log(res.result);
  })
  .catch(config => {
    console.log(config);
  });
```
## Witdraw - Receive NEO/GAS from Contract

You have to deposit some NEO/GAS to contract address in advance.

> When you want to extract NEO/GAS from a smart contract, the verification trigger of the smart contract must be satisfied. It's hard to customize high level API as the verification trigger may be different from case to case.

> In below example, verification trigger of the invoked smart contract will check the signature from contract owner

```javascript
const { default: Neon, wallet, tx, u, rpc, CONST } = require("@cityofzion/neon-js");

// The unspent tx from contract
const inputObj = {
  prevHash: "95cfeed6a101babe5df8903c72952b59e239880f3be41ab2a65fb8269284765d",
  prevIndex: 0
};

// Output to owner
const outPutObj = {
  assetId: CONST.ASSET_ID.NEO,
  value: "100",
  scriptHash: ownerAccount.scriptHash
};

// Create raw transaction
let rawTransaction = new tx.ContractTransaction();

rawTransaction.addAttribute(
  tx.TxAttrUsage.Script,
  u.reverseHex(wallet.getScriptHashFromAddress(ownerAccount.address))
);

rawTransaction.inputs[0] = new tx.TransactionInput(inputObj);
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj));

// Build invocationScript
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

// Sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  ownerAccount.privateKey
);

// Add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, ownerAccount.publicKey)
);

// Send raw transaction
const client = new rpc.RPCClient("http://rpc.url:portNum");
client
  .sendRawTransaction(rawTransaction)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```
