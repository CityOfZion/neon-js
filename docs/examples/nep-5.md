---
id: nep5
title: NEP-5
---

## Get NEP-5 Tokens Balance

### Using RPC Query to get tokens balance

```javascript
const generator = nep5.abi.balanceOf(
  "80de34fbe3e6488ce316b722c5455387b001df31",
  myAccount.address
);
const builder = generator();
const script = builder.str;
 
// local invocation
rpc.Query.invokeScript(script)
 .execute("http://localhost:30333")
 .then(res => {
    console.log(res);
 })
 .catch(config => {
    console.log(config);
 });
```



## Send NEP-5 Tokens

### Using Neon API to send tokens

```javascript
// we must change data type of contract parameters
const param_sending_address = sc.ContractParam.byteArray(
  myAccount.address,
  "address"
);
const param_receiving_address = sc.ContractParam.byteArray(
  "AN6nd3B7iQxKK23DWAFSzgykbyTjMdieXD",
  "address"
);
// we need to mul 1e8 because the format is Fixed8
const param_amount = Neon.create.contractParam("Integer", 100 * 1e8);
 
// build contract script
// using "transfer" function
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "transfer",
  args: [param_sending_address, param_receiving_address, param_amount]
};
 
const script = Neon.create.script(props);
 
const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  url: "http://localhost:30333",
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



### Using NEO-Scan API to send tokens

```javascript
// Receiver address
const receivingAddress = "AaEvSJVCD3yvoWYR75fLwNutmDKKUzaV6w";
const receivingAddressScriptHash = "3299cf047547fc89db493f10dfed26e4e5d28fca";
 
// the asset IDs of NEO and GAS
const neoAssetId =
  "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const gasAssetId =
  "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
 
// change the data type of contract parameters
const param_sending_address = sc.ContractParam.byteArray(
  myAccount.address,
  "address"
);
const param_receiving_address = sc.ContractParam.byteArray(
  receivingAddress,
  "address"
);
const param_amount = Neon.create.contractParam("Integer", 100 * 1e8);
 
// build contract script
// using "transfer" function
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "transfer",
  args: [param_sending_address, param_receiving_address, param_amount]
};
 
const script = Neon.create.script(props);
 
// create transaction by NEO-Scan API
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



### Sending tokens by constructing raw invocation transaction

```javascript
// Receiver address
const receivingAddress = "AaEvSJVCD3yvoWYR75fLwNutmDKKUzaV6w";
 
// we must change the data type of contract parameters
const param_sending_address = sc.ContractParam.byteArray(
  myAccount.address,
  "address"
);
const param_receiving_address = sc.ContractParam.byteArray(
  receivingAddress,
  "address"
);
const param_amount = Neon.create.contractParam("Integer", 100 * 1e8);
 
// build contract script
const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "transfer",
  args: [param_sending_address, param_receiving_address, param_amount]
};
 
const script = Neon.create.script(props);
 
// create transaction object
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



## Using NEO to Mint NEP-5 Tokens

### Using Neon API to mint tokens

```javascript
// now we use another account to mint tokens
const privateKey = "L264xiwmnYdmgpXEqMGCH8j8g8jpW9Bx5Xvz6xV58B9aYd1p4bEK";
const senderAccount = new wallet.Account(privateKey);
myWallet.addAccount(senderAccount);

// build config
const contractAddress = "AMtzZ3mfbXvgEDMokitAsEGbPHEgNTTbhA";
const intent = api.makeIntent({ NEO: 1 }, contractAddress);
const props = {
  scriptHash: "db62ff35f42f3418e5385d450fe7c2126a6e2943",
  operation: "mintTokens",
  args: []
};
 
const script = Neon.create.script(props);
 
const config = {
  api: apiProvider,
  url: "http://localhost:30333",
  account: senderAccount, // here is "sender address", not an "owner address".
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



### Using NEO-Scan API to mint tokens

```javascript
// now we use another account to mint tokens
const privateKey = "L264xiwmnYdmgpXEqMGCH8j8g8jpW9Bx5Xvz6xV58B9aYd1p4bEK";
const senderAccount = new wallet.Account(privateKey);
myWallet.addAccount(senderAccount);
 
// build contract script
const contractAddress = "AMtzZ3mfbXvgEDMokitAsEGbPHEgNTTbhA";
const props = {
  scriptHash: "db62ff35f42f3418e5385d450fe7c2126a6e2943",
  operation: "mintTokens",
  args: []
};
 
const script = Neon.create.script(props);
 
// create transaction by NEO-Scan API
async function createTxByNeoScan() {
  let balance = await apiProvider.getBalance(senderAccount.address);
  let transaction = new tx.InvocationTransaction({
    script: script,
    gas: 0
  });
 
  // add intent
  transaction.addIntent("NEO", 1, contractAddress);
 
  // calculate your balance and add signature
  transaction.calculate(balance).sign(senderAccount.privateKey);
  return transaction;
}
 
// send transaction
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



### Minting tokens by constructing raw invocation transaction

```javascript
const neoAssetId =
  "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
const gasAssetId =
  "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
 
 
const contractAddress = "AMtzZ3mfbXvgEDMokitAsEGbPHEgNTTbhA";
 
// your NEO unspent tx
const inputObj = {
  prevHash: "afc2db042aa9d732e3e14694a1925512741178a44b2ac854476b6eeac53e070f",
  prevIndex: 1
};
 
// output to contract address
const outPutObj1 = {
  assetId: neoAssetId,
  value: "1",
  scriptHash: "db62ff35f42f3418e5385d450fe7c2126a6e2943"
};
 
// the rest NEO
const outPutObj2 = {
  assetId: neoAssetId,
  value: "494",
  scriptHash: senderAccount.scriptHash
};
 
// build contract script
const props = {
  scriptHash: "db62ff35f42f3418e5385d450fe7c2126a6e2943",
  operation: "mintTokens",
  args: []
};
 
const script = Neon.create.script(props);
 
// create transaction object
let rawTransaction = new tx.InvocationTransaction({
  script: script,
  gas: 0
});
 
// add inputs/outputs
rawTransaction.inputs[0] = new tx.TransactionInput(inputObj);
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj1));
rawTransaction.addOutput(new tx.TransactionOutput(outPutObj2));
 
// sign transaction with sender's private key
const signature = wallet.sign(
  rawTransaction.serialize(false),
  senderAccount.privateKey
);
 
// add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, senderAccount.publicKey)
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



