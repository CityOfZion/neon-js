---
id: wallet
title: Wallet
---

## Create/Import Wallet

### Create default wallet

```javascript
// We create a wallet with name 'myWallet'. This is optional. The constructor is fine with no arguments.
const myWallet = Neon.create.wallet({ name: "MyWallet" });
// We generate a new Account and add it to the wallet
myWallet.addAccount();
```



### Import an account by WIF Key

```javascript
// We add Account "myAccount" to the wallet using a wif key.
const wifKey = "KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr";
const myAccount = new wallet.Account(privateKey);
myWallet.addAccount(myAccount);
```



### Import wallet file

```javascript
// Read the wallet.json file
const myAccount = new wallet.Account(
  JSON.parse(fs.readFileSync("./wallet.json"))
);
myWallet.addAccount(myAccount);
// we need to decrypt wallet by a password
myAccount.decrypt("wafei").then(() => {
  console.log(myAccount.WIF);
});
```



## Export Wallet

### Export a json file

```javascript
// Before export the account, you have to encrypt it.
myAccount.encrypt("wafei").then(() => {
  accountJson = myAccount.export();
  fs.writeFileSync("./wallet.json", JSON.stringify(accountJson));
});
```



## Get Balance

### Check balance by NEO-Scan API

```javascript
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



### Check balance by RPC Query

```javascript
rpc.Query.getAccountState(myWallet.accounts[1].address)
  .execute("http://localhost:30333")
  .then(response => {
    console.log(
      `NEO: ${response.result.balances[0].value},
       GAS: ${response.result.balances[1].value}`
    );
  })
  .catch("Get Balance Error!");
```

