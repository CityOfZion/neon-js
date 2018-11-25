/**
---
id: doinvoke
title: Basic - Invoking a Smart Contract
---

This is a guide to use the `doInvoke` method.If you have read `Basic - Sending Assets`, then this should feel familiar.

An Invocation Transaction is the transaction used to invoke a smart contract. Invocation of a smart contract will trigger the execution of a smart contract and persist any changes in the blockchain itself.

In this example, we will use the most commonly invoked scenario: An NEP5 token transfer.
*/

// import Neon, { api, wallet } from "@cityofzion/neon-js";
const { default: Neon, api, wallet, u, nep5 } = require("@cityofzion/neon-js");

const sendingKey =
  "3edee7036b8fd9cef91de47386b191dd76db2888a553e7736bb02808932a915b";
const receivingAddress = "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW";
const contractScriptHash = "5b7074e873973a6ed3708862f219a6fbf4d1c411";
const numOfDecimals = 8;
const amtToSend = 42.93967296;
const network = "TestNet";
const additionalInvocationGas = 0;
const additionalIntents = [];

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

const account = new wallet.Account(sendingKey);

console.log("\n\n--- Sending Address ---");
console.log(account);

/**
## Creating the Invocation Script
A smart contract is actually just a function with an arbitrary number of arguments.
However, the convention established in NEO is for smart contracts to always have the default signature of `(string operation, byte[] args)`.
Our tooling will be built for such smart contracts.

We will be making use of the `neon-nep5` package to help us generate the invocation script:
*/

// We have to adjust the amount to send because this function bumps it up by 8 decimals places according to Fixed8 rules. For NEP5 tokens of 8 decimals places, no adjustments is needed.
const generator = nep5.abi.transfer(
  contractScriptHash,
  account.address,
  receivingAddress,
  new u.Fixed8(amtToSend).div(Math.pow(10, 8 - numOfDecimals))
);
const builder = generator();
const script = builder.str;

console.log("\n\n--- Invocation Script ---");
console.log(script);
/**
## Attaching invocation fees
Running the code of a smart contract takes up CPU cycles. Thus, there must be some form of payment for the time taken to run the smart contract.
The blockchain currently gives 10 free GAS for each invocation transaction. If more GAS is required for the invocation, you may attach additional GAS.

> You can only attach GAS in integers. You may not attach 0.1, 1.1 or 123.456 GAS.

In this example, we will be attaching 0 fees but will be showing you how to attach it.
*/

const gas = additionalInvocationGas;

/**
## Additional Intents
It is possible to attach additional assets for the Invocation Transaction. This is important in some scenarios where you want the movement of assets to be also involved with the running of the smart contract.

For example, in an ICO, the `mintTokens` method will be called with an Invocation Transaction with assets being transferred to the ICO contract. In this manner, the invocation will be ran with the information of the asset transfer available to the running of the smart contract.
*/

const intent = additionalIntents;

/**
## Execute
We assemble the config object and doInvoke will do the following:

1. Retrieve the balance of sendingKey from apiProvider.
2. Retrieve a good rpc url from apiProvider.
3. Assemble the transaction using the balance, intents and gas.
4. Attach the script to the transaction.
5. Sign the transaction using the sendingKey
6. Submit the transaction to the network using the `sendrawtransaction` RPC call to the rpc url.
*/

const config = {
  api: apiProvider, // The API Provider that we rely on for balance and rpc information
  account: account, // The sending Account
  intents: intent, // Additional intents to move assets
  script: script, // The Smart Contract invocation script
  gas: gas // Additional GAS for invocation.
};

Neon.doInvoke(config)
  .then(config => {
    console.log("\n\n--- Response ---");
    console.log(config.response);
  })
  .catch(config => {
    console.log(config);
  });

/**
## About asset-less transactions

Currently, the fees for transactions are zero, making it possible for us to send transactions that are without any assets attached to them. This is done through attaching an extra `Script` attribute. The value of this attribute is the scripthash of your address. This ties the transaction to an address so that the node knows who the signature came from.

However, you will realise that without transaction inputs, it results in the possibility of collisions for transactions hashes. This is solved by attaching a nonce in the form of a remark. In `neon-js`, the `doInvoke` method detects if there are no assets attached and inserts the nonce. This nonce is crafted using a random hexstring with the current timestamp.
*/
