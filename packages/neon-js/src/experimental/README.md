# Deploying a smart contract
###Pre-requisites
* A compiled smart contract (<contract_name>.NEF + <contract_name>.manifest.json)
* A wallet with sufficient GAS
* a `CommonConfig` - a configuration object with a few general pieces of information needed to be able to create transaction and retrieve information.

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
    console.log(await Neon.experimental.deployContract(nef, manifest, config));
    // We can query the blockchain for our contract
    // Note that you'll want to delay this call after a deploy because the deploy transaction will first have to be processed.
    // At the time of writing a block is generated every 15 seconds, thus the following call might will fail until it is processed.
    // console.log(await rpc_client.getContractState(manifest.abi.hash));
  } catch (e) {
    console.log(e);
  }
}

run();
```
