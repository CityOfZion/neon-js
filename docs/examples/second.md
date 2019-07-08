---
id: second
title: The Second
---

# neon-js功能测试+例子_高华辉

# 20190530-20190605

[TOC]



## neo-local

### 1.连接到私有网络

**使用neo-local的neoscan api**(Pass)

*network-local.js*:

```javascript
const { default: Neon, rpc, api, wallet } = require("@cityofzion/neon-js");

// Connect to neo-local network
const privateNetConfig = {
  name: "PrivateNet",
  nodes: [
    "neo-cli-privatenet-1:20333",
    "neo-cli-privatenet-2:20334",
    "neo-cli-privatenet-3:20335",
    "neo-cli-privatenet-4:20336"
  ],
  extra: {
    neoscan: "http://localhost:4000/api/main_net"
  }
};

const privateNet = new rpc.Network(privateNetConfig);
Neon.add.network(privateNet, true);

// You will be able to lookup an instance of PrivateNet neoscan
const apiProvider = new api.neoscan.instance("PrivateNet");
console.log(apiProvider);
```



### 2.钱包功能

**基本功能**：

**创建钱包**(Pass)

**新建账户**(Pass)

**导入账户**(Pass)

**导出账户**(Pass)

*wallet-local.js*:

```js
const { default: Neon, rpc, api, wallet } = require("@cityofzion/neon-js");

// Connect to neo-local network
const privateNetConfig = {
  name: "PrivateNet",
  nodes: [
    "neo-cli-privatenet-1:20333",
    "neo-cli-privatenet-2:20334",
    "neo-cli-privatenet-3:20335",
    "neo-cli-privatenet-4:20336"
  ],
  extra: {
    neoscan: "http://localhost:4000/api/main_net"
  }
};

const privateNet = new rpc.Network(privateNetConfig);
Neon.add.network(privateNet, true);

// You will be able to lookup an instance of PrivateNet neoscan
const apiProvider = new api.neoscan.instance("PrivateNet");

// ---------------------------------------------------------------------

// We create a wallet with name 'myWallet'. This is optional. The constructor is fine with no arguments.
const myWallet = Neon.create.wallet({ name: "MyWallet" });

// We generate a new Account and add it to the wallet
myWallet.addAccount();

// We add Account account1 to the wallet using a private key.
const privateKey = "KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr";
const account1 = new wallet.Account(privateKey);
myWallet.addAccount(account1);

// Before export the account, you have to encrypt it.
account1.encrypt("wafei").then(() => {
  accountJson = account1.export();
  console.log(accountJson);
});
```

**使用Neoscan API查询余额（注意要转成number类型）**(Pass)

```javascript
/*The above wallet-local.js code*/

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

**使用RPC Query查询余额**(Pass)

```javascript
/*The above wallet-local.js code*/

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



### 3.NEO & GAS转账功能

**使用Neon API发送NEO和GAS**(Pass)

```javascript
/*The above wallet-local.js code*/

const receivingAddress = "AJdNhG7qh6p2CNxMnEyb5xGrER5HmsxwjH";
const intent = api.makeIntent({ NEO: 1, GAS: 1 }, receivingAddress);

const config = {
  api: apiProvider, // The network to perform the action, MainNet or TestNet.
  url: "http://localhost:30333",
  account: account1, // This is the address which the assets come from.
  intents: intent // This is where you want to send assets to.
};

Neon.sendAsset(config)
  .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
  })
  .catch(config => {
    console.log(config);
  });
```



**手动构造交易发送**(Pass)

```javascript
const { default: Neon, rpc, wallet, tx } = require("@cityofzion/neon-js");

// ------------------------------------------------------------------------------

// We create a wallet with name 'myWallet'. This is optional. The constructor is fine with no arguments.
const myWallet = Neon.create.wallet({ name: "MyWallet" });

// We add Account account1 to the wallet using a private key.
const privateKey = "KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr";
const account1 = new wallet.Account(privateKey);
myWallet.addAccount(account1);

const account1Hash = "e9eed8dc39332032dc22e5d6e86332c50327ba23";

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
  scriptHash: account1Hash
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
  account1.privateKey
);

// add witness
rawTransaction.addWitness(
  tx.Witness.fromSignature(signature, account1.publicKey)
);

// use RPC Client to send raw transaction
const rpcClient = new rpc.RPCClient("http://localhost:30333");

rpcClient
  .sendRawTransaction(rawTransaction)
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.log(err);
  });
```



**使用RPC构建交易发送NEO和GAS**(Pass)

注意：需要创建Balance！

```js
/*The above wallet-local.js code*/

let balance1 = apiProvider
  .getBalance("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y")
  .then(res => {
    balance1 = res;
    console.log(balance1.assets["NEO"].unspent[0].value.c);
    console.log(balance1.assets["GAS"].unspent[0].value.c);

    const receivingAddress = "APiQJ36jXxq8cWEf9wUxPNjVRwZayuuzmU";

    let transaction = Neon.create.contractTx();
    transaction
      .addIntent("NEO", 1, receivingAddress)
      .addRemark("I am sending 1 NEO to APiQJ36jXxq8cWEf9wUxPNjVRwZayuuzmU") // Add an remark
      .calculate(balance1)
      .sign("KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr"); // Sign with the private key of the balance

    const serializedTx = transaction.serialize();

    const client = Neon.create.rpcClient("http://localhost:30333");
    client
      .sendRawTransaction(serializedTx)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
```



### 4.Claim GAS

**使用Neon API进行claim gas**(Pass)

```js
/*The above wallet-local.js code*/

const config = {
  api: apiProvider, // The network to perform the action, MainNet or TestNet.
  url: "http://localhost:30333",
  account: account1 // This is the address which the assets come from.
};

Neon.claimGas(config)
  .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
  })
  .catch(config => {
    console.log(config);
  });
```

**使用RPC构建交易进行claim gas**（Pass）

```js
/*The above wallet-local.js code*/

apiProvider
  .getClaims(account1.address)
  .then(claims => {
    //create claim transaction
    let transaction = Neon.create.claimTx();

    // Sign with the private key of the balance
    transaction.addClaims(claims).sign(account1.privateKey);

    //use RPC Client to claim gas
    const client = Neon.create.rpcClient("http://localhost:30333");

    client
      .sendRawTransaction(transaction)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
```



### 5.智能合约

现在我们有一个简单的python智能合约：

*5-calculator.py*:

```python
def Main(operation, a, b):
    if operation == 'add':
        return a + b
    elif operation == 'sub':
        return a - b
    elif operation == 'mul':
        return a * b
    elif operation == 'div':
        return a / b
    else:
        return -1
```

Contract Hash: 0x1d36641faca64ddd0f49af488e543a0f89860690

**Neon API调用合约**(Pass)

```js
/*The above wallet-local.js code*/

const props = {
  scriptHash: "1d36641faca64ddd0f49af488e543a0f89860690",
  operation: "add",
  args: [1, 2]
};

// Returns a hexstring
// 注意scriptHash的"0x"要删掉
const script = Neon.create.script(props);
console.log(script);

const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  url: "http://localhost:30333",
  account: account1, // The sending Account
  script: script // The Smart Contract invocation script
};

Neon.doInvoke(config)
  .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
  })
  .catch(config => {
    console.log(config);
  });

```

**RPC Query调用合约（local invoke）**(Error)

log显示调用成功了，并没有看到结果

```js
/*The above wallet-local.js code*/

const sb = Neon.create.scriptBuilder();
sb.emitAppCall("1d36641faca64ddd0f49af488e543a0f89860690", "add", [1, 2]);
// Returns a hexstring
const script = sb.str;
console.log(script);

rpc.Query.invokeScript(sb.str)
  .execute("http://localhost:30333")
  .then(res => {
    console.log(res);
  })
  .catch(config => {
    console.log(config);
  });
```

**RPC Client调用合约（local invoke）**(Error)

log显示调用成功了，并没有看到结果

```js
/*The above wallet-local.js code*/

const sb = Neon.create.scriptBuilder();
sb.emitAppCall("1d36641faca64ddd0f49af488e543a0f89860690", "add", [1, 2]);
// Returns a hexstring
const script = sb.str;
console.log(script);

const client = Neon.create.rpcClient("http://localhost:30333");
client
  .invokeScript(script)
  .then(res => {
    console.log(res);
  })
  .catch(config => {
    console.log(config);
  });
```

**构建交易发送**(Error)

Error: One of the identified items was in an invalid format.

不知道这个到底是要填什么参数，我是按了源码来，但是并没什么用。

文档上也粗略地提了一下，我按文档来试过了也不行。

``` javascript
/*The above wallet-local.js code*/

let balance1 = apiProvider
  .getBalance("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y")
  .then(res => {
    balance1 = res;
    console.log(balance1.assets["NEO"].unspent[0].value.c);
    console.log(balance1.assets["GAS"].unspent[0].value.c);

    const sb = Neon.create.scriptBuilder();
    sb.emitAppCall("1d36641faca64ddd0f49af488e543a0f89860690", "add", [1, 2]);
    // Returns a hexstring
    const script = sb.str;
    console.log(script);

    invocationConfig = { script: script, gas: 1 };

    let transaction = Neon.create.invocationTx(invocationConfig);
    transaction
      .calculate(balance1)
      .sign("KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr"); // Sign with the private key of the balance

    const serializedTx = transaction.serialize();

    const client = Neon.create.rpcClient("http://localhost:30333");
    client
      .sendRawTransaction(serializedTx)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });
```



### 6.NEP-5功能

**RPC Query获取NEP-5余额**(Pass)

*查询余额的时候，账户一定要有token，不然会报错。*

```js
// import nep5 api
const { default: Neon, rpc, api, wallet, nep5 } = require("@cityofzion/neon-js");

/*The above wallet-local.js code*/

const generator = nep5.abi.balanceOf(
  "80de34fbe3e6488ce316b722c5455387b001df31",
  account1.address
);
const builder = generator();
const script = builder.str;

// invoke系列的方法都是不上链方法！
rpc.Query.invokeScript(script)
  .execute("http://localhost:30333")
  .then(res => {
    console.log(res);
  })
  .catch(config => {
    console.log(config);
  });
```



**RPC Client获取NEP-5余额**(Pass)

```javascript
// import nep5 api
const { default: Neon, rpc, api, wallet, nep5 } = require("@cityofzion/neon-js");

/*The above wallet-local.js code*/

const generator = nep5.abi.balanceOf(
  "80de34fbe3e6488ce316b722c5455387b001df31",
  account1.address
);
const builder = generator();
const script = builder.str;

const client = Neon.create.rpcClient("http://localhost:30333");
client
  .invokeScript(script)
  .then(res => {
    console.log(res);
  })
  .catch(config => {
    console.log(config);
  });
```



**Neon API发送NEP-5token**(Pass)

*不可以用rpc query！因为rpc query的三个invoke函数都是local运行，不发到网络上（不上链）*

``` js
// import sc api
const { default: Neon, rpc, api, wallet, nep5, sc } = require("@cityofzion/neon-js");

/*The above wallet-local.js code*/

const param_sending_address = sc.ContractParam.byteArray(
  account1.address,
  "address"
);
const param_receiving_address = sc.ContractParam.byteArray(
  "AN6nd3B7iQxKK23DWAFSzgykbyTjMdieXD",
  "address"
);
const param_amount = Neon.create.contractParam("Integer", 100 * 1e8);

const props = {
  scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
  operation: "transfer",
  args: [param_sending_address, param_receiving_address, param_amount]
};

const script = Neon.create.script(props);

const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  url: "http://localhost:30333",
  account: account1, // The sending Account
  script: script // The Smart Contract invocation script
  // gas: gas // Additional GAS for invocation.
};

Neon.doInvoke(config)
  .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
  })
  .catch(config => {
    console.log(config);
  });
```



**构建交易发送NEP-5 Token**(Error)

Error: One of the identified items was in an invalid format.

不知道这个到底是要填什么参数，我是按了源码来，但是并没什么用。

文档上也粗略地提了一下，我按文档来试过了也不行。

```javascript
let balance1 = apiProvider
  .getBalance("AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y")
  .then(res => {
    balance1 = res;
    console.log(balance1.assets["NEO"].unspent[0].value.c);
    console.log(balance1.assets["GAS"].unspent[0].value.c);

    const param_sending_address = sc.ContractParam.byteArray(
      account1.address,
      "address"
    );
    const param_receiving_address = sc.ContractParam.byteArray(
      "AN6nd3B7iQxKK23DWAFSzgykbyTjMdieXD",
      "address"
    );
    const param_amount = Neon.create.contractParam("Integer", 100 * 1e8);

    const props = {
      scriptHash: "80de34fbe3e6488ce316b722c5455387b001df31",
      operation: "transfer",
      args: [param_sending_address, param_receiving_address, param_amount]
    };

    const script = Neon.create.script(props);
      
    // const receivingAddress = "APiQJ36jXxq8cWEf9wUxPNjVRwZayuuzmU";
    invocationConfig = { script: script };

    let transaction = Neon.create.invocationTx(invocationConfig);
    transaction
      // .addIntent("NEO", 1, receivingAddress)
      // .addRemark("I am sending 1 NEO to APiQJ36jXxq8cWEf9wUxPNjVRwZayuuzmU") // Add an remark
      .calculate(balance1)
      .sign("KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr"); // Sign with the private key of the balance

    const serializedTx = transaction.serialize();

    const client = Neon.create.rpcClient("http://localhost:30333");
    client
      .sendRawTransaction(serializedTx)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  })
  .catch(err => {
    console.log(err);
  });

```

