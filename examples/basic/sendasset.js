/**
---
id: sendasset
title: Basic - Sending assets
---

`neon-js` provides basic out-of-the-box functionality for core functionalities:

1. Sending assets (like NEO and GAS)
2. Claiming GAS
3. Invoking smart contracts
4. Setting up your votes

These packaged functionalities come from the `neon-api` package. The methods are:

1. sendAsset
2. claimGas
3. doInvoke
4. setupVote

For this guide, we will be going through sending assets using `sendAsset`.

In NEO, the normal transaction for transferring UTXO assets is the Contract Transaction. The `sendAsset` method will help create the Contract Transaction by pulling the necesssary data from a 3rd party data source (like neoscan), assembling the transaction and sending it to the network.
*/

// import Neon, { api, wallet } from "@cityofzion/neon-js";
const { default: Neon, api, wallet } = require("@cityofzion/neon-js");

const sendingKey =
  "9ab7e154840daca3a2efadaf0df93cd3a5b51768c632f5433f86909d9b994a69";
const receivingAddress = "ASo1RcNVLiV3yQ8j3ZyZv5EWfqBBT8s2Yd";
const network = "TestNet";

/**
## Creating intents
To send an asset, we first have to create an `Intent`. Intents represent the instructions to send assets to a specific address.

> Do note that intents are only used for UTXO assets. If you are looking to send NEP5 tokens, this is not the correct way.
*/

// We want to send 1 NEO and 1 GAS to ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW
const intent = api.makeIntent({ NEO: 1, GAS: 0.00000001 }, receivingAddress);

console.log("\n\n--- Intents ---");
intent.forEach(i => console.log(i));

/**
To add more intents, simple use`api.makeIntent` to create your intents. The method returns an array of intent objects so make sure to concatenate them together.

## Selecting the API provider and network
We need to decide which provider shall we use. In this example, I shall be using `TestNet` with neoscan. As `TestNet` is built into the `neon-js` networks, we can retrieve it using its name `TestNet` instead of stating a url. For other networks such as your own private network, you will input the url of your private neoscan (for example, https://localhost:4000/api/main_net)
*/

const apiProvider = new api.neoscan.instance(network);

console.log("\n\n--- API Provider ---");
console.log(apiProvider);

/**
## Creating the Account
We create an `Account` object to store our credentials. In this example, we are using a private key to create the account because we are also signing with the same private key. However, if you wish to use an external signing function (such as a ledger), you can create the account with an address and provide the signing function instead.

This account will be the account where the assets will come from.
*/

const account = new wallet.Account(sendingKey);

console.log("\n\n--- Sending Address ---");
console.log(account);

/**
## Execute
We assemble the config object and sendAsset will do the following:

1. Retrieve the balance of sendingKey from apiProvider.
2. Retrieve a good rpc url from apiProvider.
3. Assemble the transaction using the balance and intents.
4. Sign the transaction using the sendingKey
5. Submit the transaction to the network using the `sendrawtransaction` RPC call to the rpc url.
*/

const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  account: account, // The sending Account
  intents: intent // Our sending intents
};

Neon.sendAsset(config)
  .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
  })
  .catch(config => {
    console.log(config);
  });

/**
`sendAsset` automatically does all the work in retrieving the balance, constructing the transaction, signing it and sending it off to the optimal node. When this is done, the promise returns the `config` object. The object is the same object passed in at the beginning with all the additional information used in the process appended to it. For example, the `url` field is the NEO node that sent the transaction to.

Here, we are interested in the `response` property, which contains the response from the RPC endpoint upon sending the transaction. If the transaction is successful, the `txid` is attached in the response. We can take this string and use it in a block explorer to check out our transaction.
*/
