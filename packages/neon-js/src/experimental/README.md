# Table of contents
* [Deploying a smart contract](#1)
* [NEP-17 Contract interaction](#2)
* [Arbitrary Smart Contract invocation](#3)

## <a name="1">Deploying a smart contract
The following section describes how to deploy a smart contract to the block chain using `neon-js`.

### Pre-requisites
* A compiled smart contract (<contract_name>.NEF + <contract_name>.manifest.json)
* A wallet with sufficient GAS
* a `CommonConfig` - a configuration object with a few general pieces of information needed to be able to create transaction and retrieve information.

### Steps
1. Create your smart contract using any of the available compilers
   * Python using [neo3-boa](https://github.com/CityOfZion/neo3-boa)
   * C# using [neo-devpack-dotnet](https://docs.neo.org/v3/docs/en-us/sc/gettingstarted/develop.html)

   Remember the path to your created contract

2. Deploying the contract
```javascript
const Neon = require("@cityofzion/neon-js");
const fs = require("fs").promises;

// Create an example account
const priv_key =
  "0101010101010101010101010101010101010101010101010101010101010101";
const account = new Neon.wallet.Account(priv_key);

// Next we need a `CommonConfig` that we can pass to the functions
const config = {
  networkMagic: NEON.CONST.MAGIC_NUMBER.TestNet,
  rpcAddress: "http://127.0.0.1:10332", // the RPC end point to use for retrieving information and sending the transaction to the network
  account: account,
};

async function run() {
   // Load the smart contract files from disk, in this example we assume the contract is named "sample1"
  const nef = Buffer.from(
    await fs.readFile(
      "/path/to/your/contract/sample1.nef",
      null // Specifying 'binary' causes junk bytes, because apparently it is an alias for 'latin1' *crazy*
    )
  );
  const manifest = Neon.sc.ContractManifest.fromJson(
    JSON.parse(await fs.readFile("/path/to/your/contract/sample1.manifest.json"))
  );
  try {
    // Finally, deploy and get a transaction id in return if successful
    const contract_hash = Neon.experimental.getContractHash(
      Neon.u.HexString.fromHex(acc.scriptHash),
      nef
    );
    console.log(`Atemping to deploy contract with hash: 0x${contract_hash}`);
    console.log(await Neon.experimental.deployContract(nef, manifest, config));
    // We can query the blockchain for our contract
    // Note that you'll want to delay this call after a deploy because the deploy transaction will first have to be processed.
    // At the time of writing a block is generated every 15 seconds, thus the following call might will fail until it is processed.
    // console.log(await rpc_client.getContractState(contract_hash));
  } catch (e) {
    console.log(e);
  }
}

run();
```

## <a name="2">NEP-17 Contract interaction
The following section describes how to interact with NEP-17 contracts on the blockchain.

###Pre-requisites
* (optional) A wallet with NEP-17 tokens if you want to transfer tokens, or a wallet with NEO if you want to claim GAS

### Steps
1. <a name="createconfig"></a> Create a `CommonConfig` matching your environment. Here we create a config and wallet account for our private network
```javascript
const Neon = require("@cityofzion/neon-js");
const priv_key =
  "0101010101010101010101010101010101010101010101010101010101010101";
const acc = new Neon.wallet.Account(priv_key);

const config = {
  networkMagic: 769, // Replace with your preferred network (Private network number, MainNet, TestNet)
  rpcAddress: "http://127.0.0.1:10332", // the RPC end point to use for retrieving information and sending the transaction to the network
  account: account,
};
```
2. Create a contract object and interact with it
```javascript
const NEO = new Neon.experimental.nep17.NEOContract(config);
async function run() {
  console.log(await NEO.name());
  console.log(await NEO.symbol());
  console.log(await NEO.decimals());

  console.log(
     await NEO.transfer(
     "PJbVBtzwNJUZFjwgEKGLFMj5bQumnsCqbA", // source address
     "PWYLE4NWFUqn7DRK2YhcjsRm3mp5Ts4Eod", // destination address
     123 // amount
     )
  );
}

run();
```


## <a name="3">Arbitrary Smart Contract invocation
The following section describes how to call arbitrary functions on a smart contract deployed to the blockchain.

The sample contract used in the code below has 2 basic functions looking roughly as follows
```javascript
function test_func() {
   return 2;
}

function test_func2(value) {
   return value + 1;
}
```

###Pre-requisites
* script hash of a smart contract deployed on the blockchain

### Steps
1. Create a `CommonConfig` matching your environment. See [previous section](#createconfig)
2. Create a contract object and interact with it
```javascript
const contract = new Neon.experimental.SmartContract(
  Neon.u.HexString.fromHex("0xad8c3929e008a0a981dcb5e3c3a0928becdc2a41"),
  config
);

async function run() {
  console.log(await contract.testInvoke("test_func")); // test invoke does not persist to the blockchain
}

run();
```
expected result is
```
{
  script: '10c00c09746573745f66756e630c14412adcec8b92a0c3e3b5dc81a9a008e029398cad41627d5b52',
  state: 'HALT',
  gasconsumed: '1007420',
  stack: [ { type: 'Integer', value: '2' } ],
  tx: null
}
```

If you want to persist your changes to the blockchain use `invoke()` instead. For this example we'll call `test_func2` with a function argument.

```javascript
async function run() {
   console.log(await contract.invoke("test_func2", [Neon.sc.ContractParam.integer(2)]));
}

run();
```
The result of this call will be a transaction id if successful, or an error otherwise.
