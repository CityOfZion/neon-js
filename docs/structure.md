---
id: structure
title: Structure
---

The package `neon-js` is actually composed of several packages, each offering a
different functionality.

## Core

The core package is `neon-core`, comprising of the following folders:

- `rpc`
- `sc`
- `tx`
- `u`
- `wallet`

These are the minimum packages deemed necessary for basic functionality for
interaction with the blockchain. Two other sub modules, `CONST` and `settings`
round off the core module with some defaults.

For users who just require the bare functionality, you may just use the core
package:

```js
import { tx, wallet, settings } from "@cityofzion/neon-core";
const t = new tx.Transaction();
const acct = new wallet.Account();

console.log(settings.networks); // {} (empty object as there are no defaults)
```

## Other packages

### api
Provides high level functionality for crafting transactions.

### ledger

Provides an easy wrapper for communicating with the NEO N3 app on a Ledger.

### neon-js

Constructed package using:

- `neon-core`
- `neon-api`

In addition, this package exposes a high level semantic API binding for beginner usage. The semantic API can be found in the default export of the package.

```js
const Neon = require("@cityofzion/neon-js");

console.log(Neon); // {wallet, tx, api, nep5, etc...}

const NeonJs = neon.default;

console.log(NeonJs); // {create, get, sign, verify,...}
```

The semantic API follows a convention of Verb-Noun. Any extra words beyond the first 2 is collapsed into the Noun and camelcased.

```js
NeonJs.create.stringStream("1234");
NeonJs.encrypt.privateKey("key");
```

### uri

Provides the ability to parse a NEO URI schema string into a consumable intent object.
