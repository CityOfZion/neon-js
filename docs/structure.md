---
id: structure
title: Structure
---

The package `neon-js` is actually composed of several packages, each offering a different functionality.

## Core

The core package is `neon-core`, comprising of the following packages:

- `rpc`
- `sc`
- `tx`
- `u`
- `wallet`

These are the minimum packages deemed necessary for basic functionality for interaction with the blockchain. Two other sub modules, `CONST` and `settings` round off the core module with some defaults.

For users who just require the bare functionality, you may just use the core package:

```js
import { tx, wallet, settings } from "@cityofzion/neon-core";
const t = new tx.ClaimTransaction();
const acct = new wallet.Account();

console.log(settings.networks); // {} (empty object as there are no defaults)
```

> Do note that there is no semantic interface for the core package. It is intended as a barebones library.

## Plugins

We extend the core package with plugins that extend the functionality of the core package. This way, we give developers the choice to include certain packages. This is important as not every developer require all the functionality that we can include.

You would augment the core package as such:

```js
import * as core from "@cityofzion/neon-core";
import apiPlugin from "@cityofzion/neon-api";

var myNeonPackage = apiPlugin(core);

// Now api is available for consumption
myNeonPackage.api.sendAsset({...});
```

## neon-js

`neon-js` is just an example of how you can package up `neon-core` with some plugins and defaults. It is a complete solution for a light wallet that comes with a semantic interface for easy usage.

The plugins included currently are `neon-api` and `neon-nep5`.

```js
import Neon from "@cityofzion/neon-js";

Neon.create.privateKey();
Neon.api.sendAsset({...});

console.log(Neon.settings.networks); // {MainNet: ..., TestNet: ..., CozNet: ...}
```

It comes with prefilled defaults such as publicly available networks and a semantic interface.
