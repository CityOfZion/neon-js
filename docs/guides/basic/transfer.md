---
id: neo3-guides-transfer
title: [neo3] Performing a basic transaction
---

In this tutorial, we will be performing a basic transfer of NEO from an address to another address.

In Neo2, NEO and GAS are considered native assets and operate using the UTXO
system.

In Neo3, the UTXO system is removed. In its place, NEO and GAS now implements
the NEP-5 interface. They are still considered native assets but operate very
similarly to how NEP-5 tokens work in Neo2.

First, some setup:
 

```js
const { rpc, sc, wallet, tx, u } = require("@cityofzion/neon-core");

const inputs = {
  fromAccount: new wallet.Account(
    "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
  ),
  toAccount: new wallet.Account(
    "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
  ),
  tokenScriptHash: "9bde8f209c88dd0e7ca3bf0af0f476cdd8207789",
  amountToTransfer: 1,
  systemFee: 0,
  networkFee: 0.02,
  networkMagic: 1234567890, //CONST.MAGIC_NUMBER.TestNet,
  nodeUrl: "http://localhost:20332", //"http://seed2t.neo.org:20332",
};

const vars = {};
```

We will perform the following checks:

1. The token exists. This can be done by performing a invokeFunction call.
2. The amount of token exists on fromAccount.
3. The amount of GAS for fees exists on fromAccount.

All these checks can be performed through RPC calls to a NEO node.
 

```js
const rpcClient = new rpc.RPCClient(inputs.nodeUrl);

async function createTransaction() {
  console.log("\n\n --- Today's Task ---");
  console.log(
    `Sending ${inputs.amountToTransfer} token \n` +
      `from ${inputs.fromAccount.address} \n` +
      `to ${inputs.toAccount.address}`
  );

  // Since the token is now an NEP-5 token, we transfer using a VM script.
  const script = sc.createScript({
    scriptHash: inputs.tokenScriptHash,
    operation: "transfer",
    args: [
      sc.ContractParam.hash160(inputs.fromAccount.address),
      sc.ContractParam.hash160(inputs.toAccount.address),
      inputs.amountToTransfer,
    ],
  });

  // We retrieve the current block height as we need to
  const currentHeight = await rpcClient.getBlockCount();
  vars.tx = new tx.Transaction({
    sender: inputs.fromAccount.scriptHash,
    cosigners: [
      {
        account: inputs.fromAccount.scriptHash,
        scopes: tx.WitnessScope.CalledByEntry,
      },
    ],
    validUntilBlock: currentHeight + 1000000,
    systemFee: vars.systemFee,
    script: script,
  });

  const transactionByteSize = vars.tx.serialize().length / 2;
  const networkFeeEstimate = transactionByteSize10;
  vars.tx.networkFee = u.Fixed8.fromRawNumber(networkFeeEstimate);
  console.log(
    `\u001b[32m  ✓ Network Fee estimate: ${vars.tx.networkFee.toString()} \u001b[0m`
  );
  console.log("\u001b[32m  ✓ Transaction created \u001b[0m");
}
```

First, we check that the token exists. We perform an invokeFunction RPC call
which calls the `name` method of the contract. The VM should exit successfully
with `HALT` and give us the token name if it exists.
 

```js
async function checkToken() {
  const tokenNameResponse = await rpcClient.invokeFunction(
    inputs.tokenScriptHash,
    "name"
  );

  if (tokenNameResponse.state !== "HALT") {
    throw new Error(
      "Token not found! Please check the provided tokenScriptHash is correct."
    );
  }

  vars.tokenName = u.HexString.fromBase64(
    tokenNameResponse.stack[0].value
  ).toAscii();

  console.log("\u001b[32m  ✓ Token found \u001b[0m");
}
```

We check the required systemFee for this transaction. System Fees pays for the
storage of the transaction itself in the network. It is proportional to the
number of bytes of the serialized transaction. Not very clear on the networkFees
at the moment.
 

```js
async function checkFees() {
  const script = sc.createScript({
    scriptHash: inputs.tokenScriptHash,
    operation: "transfer",
    args: [
      sc.ContractParam.hash160(inputs.fromAccount.address),
      sc.ContractParam.hash160(inputs.toAccount.address),
      inputs.amountToTransfer,
    ],
  });
  console.log(inputs.fromAccount.scriptHash);
  const invokeFunctionResponse = await rpcClient.invokeScript(script, [
    inputs.fromAccount.scriptHash,
  ]);
  if (invokeFunctionResponse.state !== "HALT") {
    throw new Error(
      "Transfer script errored out! You might not have sufficient funds for this transfer."
    );
  }
  vars.systemFee = new u.Fixed8(invokeFunctionResponse.gas_consumed);
  console.log("\u001b[32m  ✓ SystemFee found \u001b[0m");
}
```

We will also need to check that the inital address has sufficient funds for the transfer.
We look for both funds of the token we intend to transfer and GAS required to pay for the transaction.
For this, we rely on the NEP5Tracker plugin. Hopefully, the node we select has the plugin installed.
 

```js
async function checkBalance() {
  let balanceResponse;
  try {
    balanceResponse = await rpcClient.query({
      method: "getnep5balances",
      params: [inputs.fromAccount.address],
    });
  } catch (e) {
    console.log(
      "\u001b[31m  ✗ Unable to get balances as plugin was not available. \u001b[0m"
    );
    return;
  }
  // Check for token funds
  const balances = balanceResponse.balance.filter((bal) =>
    bal.asset_hash.includes(inputs.tokenScriptHash)
  );
  const balanceAmount =
    balances.length === 0 ? 0 : parseInt(balances[0].amount);
  if (balanceAmount < inputs.amountToTransfer) {
    throw new Error(`Insufficient funds! Found ${balanceAmount}`);
  } else {
    console.log("\u001b[32m  ✓ Token funds found \u001b[0m");
  }

  // Check for gas funds for fees
  const gasRequirements = new u.Fixed8(vars.tx.networkFee).plus(
    vars.tx.systemFee
  );
  const gasBalance = balanceResponse.balance.filter((bal) =>
    bal.asset_hash.includes("8c23f196d8a1bfd103a9dcb1f9ccf0c611377d3b")
  );
  const gasAmount =
    gasBalance.length === 0
      ? new u.Fixed8(0)
      : u.Fixed8.fromRawNumber(gasBalance[0].amount);

  if (gasAmount.lt(gasRequirements)) {
    throw new Error(
      `Insufficient gas to pay for fees! Required ${gasRequirements.toString()} but only had ${gasAmount.toString()}`
    );
  } else {
    console.log("\u001b[32m  ✓ Sufficient GAS for fees found \u001b[0m");
  }
}
```

And finally, to send it off to network.
 

```js
async function performTransfer() {
  const signedTransaction = vars.tx.sign(
    inputs.fromAccount,
    inputs.networkMagic
  );
  const result = await rpcClient.sendRawTransaction(
    signedTransaction.serialize(true)
  );

  console.log("\n\n--- Transaction hash ---");
  console.log(result);
}

createTransaction()
  .then(checkToken)
  .then(checkFees)
  .then(checkBalance)
  .then(performTransfer)
  .catch((err) => console.log(err));
```

You should be able to see the transaction hash printed in the console log.
After waiting for the network to process the transaction, you can check on your new account balance.
 
