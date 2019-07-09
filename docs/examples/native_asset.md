---
id: native_asset
title: Native Asset
---

> You can refer to **Precondition** part to check the initiation of `apiProvider`, `myWallet` and `myAccount`
## Get Balance

### with NEO-Scan API

```javascript
const { default: Neon, api } = require("@cityofzion/neon-js");

apiProvider
 .getBalance(myWallet.accounts[1].address)
 .then(res =>
    console.log(
      `NEO: ${res.assets["NEO"].balance.toNumber()},
       GAS: ${res.assets["GAS"].balance.toNumber()}`
   )
 )
 .catch("Get Balance Error!");
```

### with RPC Query

```javascript
const { rpc } = require("@cityofzion/neon-js");

rpc.Query.getAccountState(myWallet.accounts[1].address)
  .execute("http://rpc.url:portNum")
  .then(response => {
    console.log(
      `NEO: ${response.result.balances[0].value},
       GAS: ${response.result.balances[1].value}`
    );
  })
  .catch("Get Balance Error!");
```


## Send NEO & GAS

### with Neon API (High Level)

```javascript
const { default: Neon, api } = require("@cityofzion/neon-js");

// Receiver address
const receivingAddress = "AJdNhG7qh6p2CNxMnEyb5xGrER5HmsxwjH";
const intent = api.makeIntent({ NEO: 1, GAS: 1 }, receivingAddress);
 
// Sender configs
const config = {
  api: apiProvider, // The network to perform the action, MainNet or TestNet.
  url: "http://rpc.url:portNum",
  account: myAccount, // This is the address which the assets come from.
  intents: intent, // This is where you want to send assets to.
  gas: 0, // Optional, this is additional gas paying to system fee.
  fees: 0 // Optional, additional gas paying for network fee(prioritizing, oversize transaction).
};
 
// Neon API
Neon.sendAsset(config)
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
const { default: Neon, rpc, api } = require("@cityofzion/neon-js");

const receivingAddress = "AaEvSJVCD3yvoWYR75fLwNutmDKKUzaV6w";
 
// create contract transaction using NEO-Scan API
async function createTxWithNeoScan() {
  let balance = await apiProvider.getBalance(myAccount.address);
  let transaction = Neon.create.contractTx();
  transaction
    .addIntent("NEO", 1, receivingAddress)
    .calculate(balance)
    .sign(myAccount.privateKey);
 
  return transaction;
}
 
// Send raw transaction
const client = new rpc.RPCClient("http://rpc.url:portNum");
createTxWithNeoScan().then(transaction => {
  console.log(transaction);
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
const { default: Neon, wallet, rpc, tx } = require("@cityofzion/neon-js");

// Receiver address and script hash
const receivingAddress = "AT27F9e1HaUHi6LNhxafVFMDrajtWVksNq";
const receivingAddressScriptHash = "7b5a8ec29318ad44143a29f947357995824f2ecc";
 
const neoAssetId =
  "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const gasAssetId =
  "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
 
// create contract transaction
let rawTransaction = Neon.create.contractTx();
 
// build input objects and output objects.
let inputObj = {
  prevHash: "0bb047ad9161984806a9a1ebbac34bc9fbabd1c1e42165f9f5bf8ebbebf5b83c",
  prevIndex: 0
};
 
// note: you need to calculate the balance of your account
let outPutObj1 = {
  assetId: neoAssetId,
  value: "99999899",
  scriptHash: myAccount.scriptHash
};
 
let outPutObj2 = {
  assetId: neoAssetId,
  value: "100",
  scriptHash: receivingAddressScriptHash
};
 
// add transaction inputs and outputs
rawTransaction.inputs[0] = new tx.TransactionInput(inputObj);
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj1));
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj2));
 
// sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  myAccount.privateKey
);
 
// add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, myAccount.publicKey)
);
 
// use RPC Client to send raw transaction
const client = new rpc.RPCClient("http://rpc.url:portNum");
client
 .sendRawTransaction(rawTransaction)
 .then(response => {
    console.log(response);
 })
 .catch(err => {
    console.log(err);
 });
```



## Claim GAS

### With Neon API (High Level)

```javascript
const { default: Neon, api } = require("@cityofzion/neon-js");

// Claimer configs
const config = {
  api: apiProvider, // The network to perform the action, MainNet or TestNet.
  url: "http://rpc.url:portNum",
  account: myAccount // This is the address which the assets come from.
};
 
// Neon API
Neon.claimGas(config)
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
const { default: Neon, rpc, api } = require("@cityofzion/neon-js");

// create claim transaction using NEO-Scan API
async function createTxWithNeoScan() {
  let claims = await apiProvider.getClaims(myAccount.address);
  let transaction = Neon.create.claimTx();
  transaction.addClaims(claims).sign(myAccount.privateKey);
  return transaction;
}
 
// Send raw transaction
const client = new rpc.RPCClient("http://rpc.url:portNum");
createTxWithNeoScan().then(transaction => {
  console.log(transaction);
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



### Constructing Raw transaction

This method is not recommended in neon-js.

```javascript
const { default: Neon, wallet, rpc, tx } = require("@cityofzion/neon-js");

// Receiver address and script hash
const receivingAddress = "AaEvSJVCD3yvoWYR75fLwNutmDKKUzaV6w";
const receivingAddressScriptHash = "3299cf047547fc89db493f10dfed26e4e5d28fca";
 
const neoAssetId =
  "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const gasAssetId =
  "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
 
//outputs of transferring NEO to make gas claimable. RPC: getclaimable()
let claimObj1 = {
  prevHash: "2d19bf5816c514a2f1744a30705c58b7e6656f67e26f7cc4e76b7a91ee390199",
  prevIndex: 1
};
 
let claimObj2 = {
  prevHash: "987821606da61c9cd8ab4df15d8b81b8053f107b0455f5f820a5716e00e97ea4",
  prevIndex: 1
};
 
let outPutObj1 = {
  assetId: gasAssetId,
  value: "29011.99940376",  //available GAS, RPC: getunclaimed()
  scriptHash: myAccount.scriptHash
};
 
let claims = [
  new tx.TransactionInput(claimObj1),
  new tx.TransactionInput(claimObj2)
];
 
const claimsObj = {
  claims: claims
};
 
let rawTransaction = new tx.ClaimTransaction(claimsObj);
 
// add transaction inputs and outputs
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj1));
 
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