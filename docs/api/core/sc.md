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

Users interact with smart contracts through Transactions. These transactions carry the hex output from scriptBuilder and
to the network for processing.

To test out smart contracts, you are better off using RPC calls:

- `invoke`
- `invokefunction`
- `invokescript`

These RPC calls execute the provided script and  returns the result based on the current blockchain state.
However, it is not actually recorded on the chain. Thus, their purpose is to test out the script to
ensure validity and find out the gas cost required.

For example, in the NEP-17 token standard, we do not require an actual transaction
to retrieve the name or symbol of the token. Thus, it is better to use a
`invoke` RPC call instead of a real Transaction which costs gas.

We will use a transaction when we want to effect a state change. For example, we
want to transfer tokens from address A to B. We will use invoke to ensure the
script is valid before sending the actual transaction.

---

## Classes

### ScriptBuilder

The `ScriptBuilder` is an object that converts a smart contract method call into
a hexstring that can be sent to the network with a Transaction.

```js
const sb = Neon.create.scriptBuilder();
// Build script to call 'symbol()' from contract at ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5
sb.emitAppCall("ef4073a0f2b305a38ec4050e4d3d28bc40ea63f5", "symbol");

// Test the script with invokescript
rpc.Query.invokeScript(sb.str).execute(nodeURL);
```

You may chain multiple calls together in a single VM script. The results will be
returned in order.

```js
const sb = Neon.create.scriptBuilder();
sb.emitAppCall(scriptHash, "decimals").emitAppCall(scriptHash, "symbol");

// Returns decimals, symbol
rpc.Query.invokeScript(sb.str)
  .execute("http://seed1.neo.org:10332")
  .then((res) => {
    console.log(res);
  });
```

A simple wrapper method is provided for convenience.

```js
const props = {
  scriptHash: Neon.CONST.NATIVE_CONTRACT_HASH.NeoToken,
  operation: "symbol",
  args: [],
};
// Returns a hexstring
const vmScript = Neon.create.script(props);
```

### ContractParam

ContractParam objects provide a convenient way to construct calls for `invoke`
and `invokefunction`. These RPC calls utilise a JSON struct for arguments and
can be messy to create by hand:

```js
  {
    type: String,
    value: 'this is a string'
  }
```

ContractParam currently supports creating string, boolean, integer, bytearray
and array.

```js
const param1 = Neon.create.contractParam("String", "balanceOf");
// This will automatically convert an address to a scriptHash that smart contracts use.
const param2 = sc.ContractParam.hash160("NNtxeX9UhKfHySqPQ29hQnZe22k8LwcFk1");

rpc.Query.invoke(
  CONST.NATIVE_CONTRACT_HASH.NeoToken,
  param1,
  sc.ContractParam.array(param2)
).then((res) => {
  console.log(res);
});
```

ContractParams are compatible with ScriptBuilder, so it is fine to pass them in as arguments directly.
