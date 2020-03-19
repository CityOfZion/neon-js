---
id: native_asset
title: Native Asset
---

> You can refer to **Precondition** part to check the initiation of `apiProvider`, `myWallet` and `myAccount`

## Get Balance

### Neonscan API Provider

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

### RPC Query

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

### High Level

```javascript
const { default: Neon, api } = require("@cityofzion/neon-js");

// Receiver address
const RECEIVER_ADDRESS = "AJdNhG7qh6p2CNxMnEyb5xGrER5HmsxwjH";
const intent = api.makeIntent({ NEO: 1, GAS: 1 }, RECEIVER_ADDRESS);

// Sender configs
const config = {
  api: apiProvider, // Network
  url: "http://rpc.url:portNum", // RPC URL
  account: myAccount, // Your Account
  intents: intent, // Where you want to send assets to.
  gas: 0, // Optional, system fee
  fees: 0 // Optional, network fee
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

### Low Level

```javascript
const { default: Neon, rpc, api } = require("@cityofzion/neon-js");

const RECEIVER_ADDRESS = "AaEvSJVCD3yvoWYR75fLwNutmDKKUzaV6w";

// Create contract transaction using Neoscan API
async function createTxWithNeoScan() {
  let balance = await apiProvider.getBalance(myAccount.address);
  let transaction = Neon.create.contractTx();
  transaction
    .addIntent("NEO", 1, RECEIVER_ADDRESS)
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

### Raw Level

```javascript
const { default: Neon, wallet, rpc, tx, CONST } = require("@cityofzion/neon-js");

const toAccount = new wallet.Account("AT27F9e1HaUHi6LNhxafVFMDrajtWVksNq");

// Create contract transaction
let rawTransaction = Neon.create.contractTx();

// Build input objects and output objects.
let inputObj = {
  prevHash: "0bb047ad9161984806a9a1ebbac34bc9fbabd1c1e42165f9f5bf8ebbebf5b83c",
  prevIndex: 0
};

// note: you need to calculate the balance of your account
let outPutObj1 = {
  assetId: CONST.ASSET_ID.NEO,
  value: "99999899",
  scriptHash: myAccount.scriptHash
};

let outPutObj2 = {
  assetId: CONST.ASSET_ID.NEO,
  value: "100",
  scriptHash: toAccount.scriptHash
};

// Add transaction inputs and outputs
rawTransaction.inputs[0] = new tx.TransactionInput(inputObj);
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj1));
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj2));

// Sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  myAccount.privateKey
);

// Add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, myAccount.publicKey)
);

// Use RPC Client to send raw transaction
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

### High Level

```javascript
const { default: Neon, api } = require("@cityofzion/neon-js");

// Claimer configs
const config = {
  api: apiProvider, // Network
  url: "http://rpc.url:portNum", // RPC URL
  account: myAccount // Your Account
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

### Low Level 

```javascript
const { default: Neon, rpc, api } = require("@cityofzion/neon-js");

// create claim transaction using Neoscan API
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

### Raw Level

```javascript
const { default: Neon, wallet, rpc, tx, CONST } = require("@cityofzion/neon-js");

// RPC: getclaimable()
let claimObj1 = {
  prevHash: "2d19bf5816c514a2f1744a30705c58b7e6656f67e26f7cc4e76b7a91ee390199",
  prevIndex: 1
};

let claimObj2 = {
  prevHash: "987821606da61c9cd8ab4df15d8b81b8053f107b0455f5f820a5716e00e97ea4",
  prevIndex: 1
};

let outPutObj1 = {
  assetId: CONST.ASSET_ID.GAS,
  value: "29011.99940376", // RPC: getunclaimed()
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

// Add transaction inputs and outputs
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj1));

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
