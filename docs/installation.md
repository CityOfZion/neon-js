---
id: installation
title: Installation
---

`neon-js` lives in the NPM system under the organization `cityofzion`.

## Install

To install

```sh
npm install @cityofzion/neon-js
```

For a specific commit or release, add the commit hash / tag / branch behind:

```sh
npm install @cityofzion/neon-js#dev
```

## Import

neon-js supports 2 kinds of imports.

A default import will import the semantic version of neon. Use this if you are new or just want the whole package to use.

```js
import Neon from "@cityofzion/neon-js";

Neon.create.claimTx(...args);
const query = Neon.create.query();
```

Modules are exposed through named imports. This allows more fine grained control and access to individual modules.

```js
import { rpc, tx } from "@cityofzion/neon-js";

Neon.tx.createClaimTx(...args);
const query = new rpc.Query();
```

## Require

As neon-js package uses ES6 module conventions, `require` will need to specify which module do they want exactly:

```js
var neonJs = require('@cityofzion/neon-js')

// Semantic Style by using default import
var Neon = neonJs.default
const query = Neon.create.query()

// Named imports are available too
var wallet = neonJs.wallet
var tx = neonJs.tx

const account = new wallet.Account(privateKey)
```

## Web

neon-js is also packaged for the web. You can add it through a script tag

```html
  <script src="./lib/browser.js"></script>
```

The library will be available as a global variable `Neon`. Similar to `require` style, you will have the semantic style under `default` and the rest of the named modules exposed at the same level.
