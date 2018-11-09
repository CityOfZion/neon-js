---
id: nep5
title: NEP5
---

The `nep5` module is available as the plugin `@cityofzion/neon-nep5`.

```js
import Neon from "@cityofzion/neon-js";
const rpxScriptHash = Neon.CONST.CONTRACTS.TEST_RPX;
Neon.get.tokenInfo("http://seed1.neo.org:20332", rpxScriptHash);
Neon.get.tokenBalance("http://seed1.neo.org:20332", rpxScriptHash, address);

import { api } from "@cityofzion/neon-js";
api.nep5.getTokenInfo("http://seed1.neo.org:20332", rpxScriptHash);
api.nep5.getTokenBalance("http://seed1.neo.org:20332", rpxScriptHash);
// This is a combination of both info and balance within a single call
api.nep5.getToken("http://seed1.neo.org:20332", rpxScriptHash, address);
```

The NEP5 Standard describes a set of methods to implement as a token in a smart contract. This is the NEO equivalent of the ERC-20 token standard in Ethereum.

This package offers 2 sets of methods:

1. The ABI as functions to easily generate scripts for the functions.
2. High level API that offer common functionality. (This set of methods rely on the NEO node having version >= 2.3.3.)

---

## ABI

The ABI functions follow the standard as proposed in the NEP-5 document. Each function is named after its respective contract method and is initialized with the scripthash of the NEP-5 contract followed by any arguments necessary.

The initialization function returns a function that is primed to generate the script. This function takes an optional ScriptBuilder to attach the script to.

```ts
import { nep5, sc } from "@cityofzion/neon-js";
const nameScript: string = nep5.name(scriptHash)().str;

const balanceOfFunc = nep5.balanceOf(scriptHash, addr);
const sb = new sc.ScriptBuilder();
console.log(sb.str); // empty string
balanceOfFunc(sb);
console.log(sb.str); // script for getting balance of <addr> from contract <scriptHash>
```

## Methods

The 2 main methods available are `getToken` and `getTokenBalance`.

`getToken` returns an object containing the various information about the token such as name, symbol, etc. You may put in an optional address and the balance of the address is also returned in the object.

`getTokenBalance` returns only the balance of the address for the specified smart contract.

Do note that both methods are adjusted for the number of decimals available for the token in question.

```ts
import { nep5 } from "@cityofzion/neon-js";

const tokenInfo = await nep5.getToken(rpcAddr, scriptHash);
const balance = await nep5.getTokenBalance(rpcAddr, scriptHash, addr);
```
