---
id: sc
title: Smart Contract
---

The `sc` module is exposed as:

```js
import Neon, { sc } from "@cityofzion/neon-js";
const sb = Neon.create.scriptBuilder();
const alternative = new sc.scriptBuilder();
```

In NEO, users interact with smart contracts through InvocationTransactions. These transactions carry the hex output from scriptBuilder and assets involved to the network for processing.

To test out smart contracts, you are better off using RPC calls:

- `invoke`
- `invokefunction`
- `invokescript`

These are implemented in v2.3.3. These RPC calls execute the provided script and returns the result based on the current blockchain state. However, it is not actually recorded on the chain. Thus, their purpose is to test out the script to ensure validity and find out the gas cost required.

For example, in the NEP5 token standard, we do not require an actual transaction to retrieve the name or symbol of the token. Thus, it is better to use a `invoke` RPC call instead of a real invocationTransaction.

We will use a transaction when we want to effect a state change. For example, we want to transfer tokens from address A to B. We will use invoke to ensure the script is valid before sending the actual transaction.

---

## Classes

### ScriptBuilder

The `ScriptBuilder` is an object that converts a smart contract method call into a hexstring that can be sent to the network with a InvocationTransaction.

```js
const sb = Neon.create.scriptBuilder();
// Build script to call 'name' from contract at 5b7074e873973a6ed3708862f219a6fbf4d1c411
sb.emitAppCall("5b7074e873973a6ed3708862f219a6fbf4d1c411", "name");

// Test the script with invokescript
rpc.Query.invokeScript(sb.str).execute(nodeURL);

// Create InvocationTransaction for real execution
const tx = Neon.create.invocationTx(publicKey, {}, {}, sb.str, 0);
```

You may chain multiple calls together in a single VM script. The results will be returned in order.

```js
const sb = Neon.create.scriptBuilder();
sb.emitAppCall(scriptHash, "name").emitAppCall(scriptHash, "symbol");

// Returns name, symbol
rpc.Query.invokeScript(sb.str)
  .execute(Neon.CONST.DEFAULT_RPC.MAIN)
  .then(res => {
    console.log(res);
  });
```

A simple wrapper method is provided for convenience.

```js
const props = {
  scriptHash: Neon.CONST.CONTRACTS.TEST_RPX,
  operation: "name",
  args: []
};
// Returns a hexstring
const vmScript = Neon.create.script(props);
```

The ScriptBuilder can also reverse scripts back to its arguments. However, this process is not a complete reverse engineer due to the varied nature of arguments. The arguments are returned as hexstrings and it is left to the developer to parse them meaningfully.

```js
const sb = new sb.ScriptBuilder(
  "00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc"
);
const params = sb.toScriptParams();
params = [
  {
    scriptHash: "dc675afc61a7c0f7b3d2682bf6e1d8ed865a0e5f",
    args: [
      "6e616d65", // 'name' in hexstring
      []
    ],
    useTailCall: false
  }
];
```

### ContractParam

ContractParam objects provide a convenient way to construct calls for `invoke` and `invokefunction`. These RPC calls utilise a JSON struct for arguments and can be messy to create by hand:

```js
  {
    type: String,
    value: 'this is a string'
  }
```

ContractParam currently supports creating string, boolean, integer, bytearray and array.

```js
const param1 = Neon.create.contractParam("String", "balanceOf");
// This is a convenient way to convert an address to a reversed scriptHash that smart contracts use.
const param2 = sc.ContractParam.byteArray(
  "AVf4UGKevVrMR1j3UkPsuoYKSC4ocoAkKx",
  "address"
);

rpc.Query.invoke(
  CONST.CONTRACTS.TEST_RPX,
  param1,
  sc.ContractParam.array(param2)
).then(res => {
  console.log(res);
});
```

ContractParams are compatible with ScriptBuilder so it is fine to pass them in as arguments directly.
