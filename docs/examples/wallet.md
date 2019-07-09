---
id: wallet
title: Wallet
---

## Create/Import Wallet

### Create wallet and random account

In this way, the SDK will generate a random key pair.

```javascript
const { default: Neon, wallet } = require("@cityofzion/neon-js");

// We create a wallet with name 'myWallet'. This is optional. The constructor is fine with no arguments.
const myWallet = Neon.create.wallet({ name: "MyWallet" });
// We generate a new Account and add it to the wallet
myWallet.addAccount();
```

### Import account by WIF

```javascript
const { default: Neon, wallet } = require("@cityofzion/neon-js");

// We add Account "myAccount" to the wallet using a wif key.
const wifKey = "KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr";
const myAccount = new wallet.Account(privateKey);
myWallet.addAccount(myAccount);
```



### Import wallet by nep6 file

```javascript
const { default: Neon, wallet } = require("@cityofzion/neon-js");

// Read the wallet.json file
const myAccount = new wallet.Account(
  JSON.parse(fs.readFileSync("./wallet.json"))
);
myWallet.addAccount(myAccount);
// we need to decrypt wallet by a password
myAccount.decrypt("password").then(() => {
  console.log(myAccount.WIF);
});
```



## Export Wallet

### Export a JSON file

```javascript
const { default: Neon, wallet, fs } = require("@cityofzion/neon-js");

// Before export the account, you have to encrypt it.
myAccount.encrypt("password").then(() => {
  accountJson = myAccount.export();
  fs.writeFileSync("./wallet.json", JSON.stringify(accountJson));
});
```