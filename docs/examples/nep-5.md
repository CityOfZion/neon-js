---
id: nep5
title: NEP-5
---

> You can refer to **Precondition** part to check the initiation of `apiProvider`, `myWallet` and `myAccount`

## Get Balance

### With RPC Query

```javascript
const { default: Neon, nep5, rpc } = require("@cityofzion/neon-js");

const scBuilder = nep5.abi.balanceOf(
  "80de34fbe3e6488ce316b722c5455387b001df31",
  myAccount.address
);
const script = scBuilder().str;

// local invocation
rpc.Query.invokeScript(script)
  .execute("http://rpc.url:portNum")
  .then(res => {
    console.log(res);
  })
  .catch(config => {
    console.log(config);
  });
```

## Send NEP-5

### High Level

```javascript
const { default: Neon, api, sc } = require("@cityofzion/neon-js");

const contractScriptHash = "80de34fbe3e6488ce316b722c5455387b001df31";
const to_addr = "AN6nd3B7iQxKK23DWAFSzgykbyTjMdieXD";
const scBuilder =  nep5.abi.transfer(contractScriptHash, myAccount.address, to_addr , 100);
const script = scBuilder().str;

const config = {
  api: apiProvider, // Network
  url: "http://rpc.url:portNum", // RPC URL
  account: myAccount, // Your Account
  script: script, // The Smart Contract invocation script
  gas: 0, // Optional, system fee.
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
const { default: Neon, api, sc, wallet, tx, u, rpc } = require("@cityofzion/neon-js");

// Receiver address
const RECEIVER_ADDRESS = "AaEvSJVCD3yvoWYR75fLwNutmDKKUzaV6w";

// Instead of nep abi script builder, we build contract method param here.
// Change the data type of contract parameters
const param_sending_address = sc.ContractParam.byteArray(
  myAccount.address,
  "address"
);
const param_receiving_address = sc.ContractParam.byteArray(
  RECEIVER_ADDRESS,
  "address"
);
const param_amount = Neon.create.contractParam("Integer", 100 * 1e8);

// Build contract script
// Using "transfer" function
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "transfer",
  args: [param_sending_address, param_receiving_address, param_amount]
};

const script = Neon.create.script(props);

// Create transaction by Neoscan API
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

// send transaction
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
const { default: Neon, sc, wallet, tx, u, rpc } = require("@cityofzion/neon-js");

// Receiver address
const RECEIVER_ADDRESS = "AaEvSJVCD3yvoWYR75fLwNutmDKKUzaV6w";

// We must change the data type of contract parameters
const param_sending_address = sc.ContractParam.byteArray(
  myAccount.address,
  "address"
);
const param_receiving_address = sc.ContractParam.byteArray(
  RECEIVER_ADDRESS,
  "address"
);
const param_amount = Neon.create.contractParam("Integer", 100 * 1e8);

// Build contract script
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "transfer",
  args: [param_sending_address, param_receiving_address, param_amount]
};

const script = Neon.create.script(props);

// Create transaction object
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

## Mint Tokens

> NOTE: You have to define the "mint_token" method in your NEP-5 contract.

### High Level

```javascript
const { default: Neon, wallet, api } = require("@cityofzion/neon-js");

// Now we use another account to mint tokens
const SENDER_WIF = "L264xiwmnYdmgpXEqMGCH8j8g8jpW9Bx5Xvz6xV58B9aYd1p4bEK";
const senderAccount = new wallet.Account(SENDER_WIF);
myWallet.addAccount(senderAccount);

// Build config
const CONTRACT_ADDRESS = "AMtzZ3mfbXvgEDMokitAsEGbPHEgNTTbhA";
const intent = api.makeIntent({ NEO: 1 }, CONTRACT_ADDRESS);
const props = {
  scriptHash: "db62ff35f42f3418e5385d450fe7c2126a6e2943",
  operation: "mintTokens",
  args: []
};

const script = Neon.create.script(props);

const config = {
  api: apiProvider, // Network
  url: "http://rpc.url:portNum", // RPC URL
  account: senderAccount, // Sender's Account
  intents: intent,
  script: script
};

// Neon API
Neon.doInvoke(config)
  .then(res => {
    console.log("\n\n--- Response ---");
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
```

### Low Level

```javascript
const { default: Neon, wallet, api, rpc } = require("@cityofzion/neon-js");

// Now we use another account to mint tokens
const privateKey = "L264xiwmnYdmgpXEqMGCH8j8g8jpW9Bx5Xvz6xV58B9aYd1p4bEK";
const senderAccount = new wallet.Account(privateKey);
myWallet.addAccount(senderAccount);

// Build contract script
const CONTRACT_ADDRESS = "AMtzZ3mfbXvgEDMokitAsEGbPHEgNTTbhA";
const props = {
  scriptHash: "db62ff35f42f3418e5385d450fe7c2126a6e2943",
  operation: "mintTokens",
  args: []
};

const script = Neon.create.script(props);

// Create transaction by Neoscan API
async function createTxByNeoScan() {
  let balance = await apiProvider.getBalance(senderAccount.address);
  let transaction = new tx.InvocationTransaction({
    script: script,
    gas: 0
  });

  // Add intent
  transaction.addIntent("NEO", 1, CONTRACT_ADDRESS);

  // Calculate your balance and add signature
  transaction.calculate(balance).sign(senderAccount.privateKey);
  return transaction;
}

// Send transaction
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
const { default: Neon, wallet, tx, rpc, CONST } = require("@cityofzion/neon-js");

const CONTRACT_ADDRESS = "AMtzZ3mfbXvgEDMokitAsEGbPHEgNTTbhA";

// Your NEO unspent tx
const inputObj = {
  prevHash: "afc2db042aa9d732e3e14694a1925512741178a44b2ac854476b6eeac53e070f",
  prevIndex: 1
};

// Output to contract address
const outPutObj1 = {
  assetId: CONST.ASSET_ID.NEO,
  value: "1",
  scriptHash: "db62ff35f42f3418e5385d450fe7c2126a6e2943"
};

// The rest NEO
const outPutObj2 = {
  assetId: CONST.ASSET_ID.NEO,
  value: "494",
  scriptHash: senderAccount.scriptHash
};

// Build contract script
const props = {
  scriptHash: "db62ff35f42f3418e5385d450fe7c2126a6e2943",
  operation: "mintTokens",
  args: []
};

const script = Neon.create.script(props);

// Create transaction object
let rawTransaction = new tx.InvocationTransaction({
  script: script,
  gas: 0
});

// Add inputs/outputs
rawTransaction.inputs[0] = new tx.TransactionInput(inputObj);
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj1));
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj2));

// Sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  senderAccount.privateKey
);

// Add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, senderAccount.publicKey)
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