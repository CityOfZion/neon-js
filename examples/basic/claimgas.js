/**
---
id: claimgas
title: Basic - Claiming Gas
---

This is a basic tutorial to claim gas using the `claimGas` method. If you have read `Basic - Sending Assets`, then this should feel familiar. The process is similar and is even easier.

Claiming of GAS is built into the NEO blockchain and done through the Claim Transaction. In order to claim GAS, you must have some spent NEO UTXO. This means that you should have sent some NEO from the claiming address to any address (this includes yourself) after your last claim. You are unable to claim GAS for any NEO that has not been moved.

> NOTE: This does not automatically send your NEO to yourself. It is merely performing the claim action for any claimable GAS.
*/

// import Neon, { api, wallet } from "@cityofzion/neon-js";
const { default: Neon, api, wallet } = require("@cityofzion/neon-js");

const claimingPrivateKey =
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69";
const network = "TestNet";

/**
## Selecting the API provider and network
Like in `sendAsset`, we establish the network we are interacting with through the selection of a API provider.
*/

const apiProvider = new api.neoscan.instance("TestNet");

console.log("\n\n--- API Provider ---");
console.log(apiProvider);

/**
## Creating the Account
Similar to `sendAsset`, we are using an Account object to encapsulate our private key.

This account will be the account to claim gas from.
*/

const account = new wallet.Account(claimingPrivateKey);

console.log("\n\n--- Claiming Address ---");
console.log(account);

/**
## Execute
We assemble the config object and claimGas will do the following:

1. Retrieve the claims of claimingPrivateKey from apiProvider.
2. Retrieve a good rpc url from apiProvider.
3. Assemble the transaction using the claims.
4. Sign the transaction using the claimingPrivateKey
5. Submit the transaction to the network using the `sendrawtransaction` RPC call to the rpc url.
*/

const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  account: account // The claiming Account
};

Neon.claimGas(config)
  .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
  })
  .catch(config => {
    console.log(config);
  });

/**
## Notes
While it is possible to claim gas and send it to another address, this method assumes that you are claiming it and sending it to the same address.
*/
