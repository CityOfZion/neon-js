---
id: structure
title: Structure
---

The package `neon-js` is actually composed of several packages, each offering a
different functionality.

## Core

The core package is `neon-core`, comprising of the following packages:

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
const t = new tx.ClaimTransaction();
const acct = new wallet.Account();

console.log(settings.networks); // {} (empty object as there are no defaults)
```