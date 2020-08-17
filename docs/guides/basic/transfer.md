---
id: transfer
title: Performing a basic transaction
---

In this tutorial, we will be performing a basic transfer of NEO from an address
to another address.

In Neo2, NEO and GAS are considered native assets and operate using the UTXO
system.

In Neo3, the UTXO system is removed. In its place, NEO and GAS now implements
the NEP-5 interface. They are still considered native assets but operate very
similarly to how NEP-5 tokens work in Neo2.

First, some setup:

```js
const { CONST, rpc, sc, wallet, tx, u } = require("@cityofzion/neon-core");

const inputs = {
  fromAccount: new wallet.Account(
    "L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g"
  ),
  toAccount: new wallet.Account(
    "L2QTooFoDFyRFTxmtiVHt5CfsXfVnexdbENGDkkrrgTTryiLsPMG"
  ),
  tokenScriptHash: CONST.ASSET_ID.NEO,
  amountToTransfer: 1,
  systemFee: 0,
  networkFee: 0,
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
    signers: [
      {
        account: inputs.fromAccount.scriptHash,
        scopes: tx.WitnessScope.CalledByEntry,
      },
    ],
    validUntilBlock: currentHeight + 1000000,
    systemFee: vars.systemFee,
    script: script,
  });
  console.log("\u001b[32m  ✓ Transaction created \u001b[0m");
}
```

Network fees pay for the processing and storage of the transaction in the
network. There is a cost incurred per byte of the transaction (without the
signatures) and also the cost of running the verification of signatures.

```js
async function checkNetworkFee() {
  const feePerByteInvokeResponse = await rpcClient.invokeFunction(
    CONST.NATIVE_CONTRACTS.POLICY,
    "getFeePerByte"
  );

  if (feePerByteInvokeResponse.state !== "HALT") {
    if (inputs.networkFee === 0) {
      throw new Error("Unable to retrieve data to calculate network fee.");
    } else {
      console.log(
        "\u001b[31m  ✗ Unable to get information to calculate network fee.  Using user provided value.\u001b[0m"
      );
      vars.tx.networkFee = new u.Fixed8(inputs.networkFee);
    }
  }
  const feePerByte = u.Fixed8.fromRawNumber(
    feePerByteInvokeResponse.stack[0].value
  );
  // Account for witness size
  const transactionByteSize = vars.tx.serialize().length / 2 + 109;
  // Hardcoded. Running a witness is always the same cost for the basic account.
  const witnessProcessingFee = u.Fixed8.fromRawNumber(1000390);
  const networkFeeEstimate = feePerByte
    .mul(transactionByteSize)
    .add(witnessProcessingFee);
  if (inputs.networkFee && inputs.networkFee >= networkFeeEstimate.toNumber()) {
    vars.tx.networkFee = new u.Fixed8(inputs.networkFee);
    console.log(
      `  i Node indicates ${networkFeeEstimate.toNumber()} networkFee but using user provided value of ${
        inputs.networkFee
      }`
    );
  } else {
    vars.tx.networkFee = networkFeeEstimate;
  }
  console.log(
    `\u001b[32m  ✓ Network Fee set: ${vars.tx.networkFee.toNumber()} \u001b[0m`
  );
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

SystemFees pay for the processing of the script carried in the transaction. We
can easily get this number by using invokeScript with the appropriate signers.

```js
async function checkSystemFee() {
  const script = sc.createScript({
    scriptHash: inputs.tokenScriptHash,
    operation: "transfer",
    args: [
      sc.ContractParam.hash160(inputs.fromAccount.address),
      sc.ContractParam.hash160(inputs.toAccount.address),
      inputs.amountToTransfer,
    ],
  });
  const invokeFunctionResponse = await rpcClient.invokeScript(script, [
    {
      account: inputs.fromAccount.scriptHash,
      scopes: tx.WitnessScope.CalledByEntry,
    },
  ]);
  if (invokeFunctionResponse.state !== "HALT") {
    throw new Error(
      "Transfer script errored out! You might not have sufficient funds for this transfer."
    );
  }
  const requiredSystemFee = u.Fixed8.fromRawNumber(
    invokeFunctionResponse.gasconsumed
  );
  if (inputs.systemFee && inputs.systemFee >= requiredSystemFee) {
    vars.tx.systemFee = new u.Fixed8(inputs.systemFee);
    console.log(
      `  i Node indicates ${requiredSystemFee} systemFee but using user provided value of ${inputs.systemFee}`
    );
  } else {
    vars.tx.systemFee = requiredSystemFee;
  }
  console.log(
    `\u001b[32m  ✓ SystemFee set: ${vars.tx.systemFee.toString()}\u001b[0m`
  );
}
```

We will also need to check that the inital address has sufficient funds for the
transfer. We look for both funds of the token we intend to transfer and GAS
required to pay for the transaction. For this, we rely on the NEP5Tracker
plugin. Hopefully, the node we select has the plugin installed.

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
    bal.assethash.includes(inputs.tokenScriptHash)
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
    bal.assethash.includes(CONST.ASSET_ID.GAS)
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
    console.log(
      `\u001b[32m  ✓ Sufficient GAS for fees found (${gasRequirements.toString()}) \u001b[0m`
    );
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

  console.log(vars.tx.toJson());
  const result = await rpcClient.sendRawTransaction(
    signedTransaction.serialize(true)
  );

  console.log("\n\n--- Transaction hash ---");
  console.log(result);
}

createTransaction()
  .then(checkToken)
  .then(checkNetworkFee)
  .then(checkSystemFee)
  .then(checkBalance)
  .then(performTransfer)
  .catch((err) => console.log(err));
```

You should be able to see the transaction hash printed in the console log. After
waiting for the network to process the transaction, you can check on your new
account balance.
