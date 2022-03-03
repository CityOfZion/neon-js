---
id: structure
title: Structure
---

The package `neon-js` is actually composed of several packages, each offering a
different functionality.

## Core

The core package is `neon-core`, comprised of the following folders:

- `rpc`
- `sc`
- `tx`
- `u`
- `wallet`

These are the minimum packages deemed necessary for basic functionality for
interaction with the blockchain. The sub module `CONST` rounds off the core module with some defaults.

For users who just require the bare functionality, you may just use the core
package:

```js
import { tx, wallet } from "@cityofzion/neon-core";
const t = new tx.Transaction();
const acct = new wallet.Account();
```
