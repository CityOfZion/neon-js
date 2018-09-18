# neon-nep5

## Overview

Neon-NEP5 plugin. Provides the package `nep5` within `neon-js`.

- ABI functions to quickly craft function calls.
- High level functions to get NEP5 token information.

## Installation

```sh
yarn i @cityofzion/neon-nep5 @cityofzion/neon-core
```

```js
const neonCore = require("@cityofzion/neon-core");
const nep5Plugin = require("@cityofzion/neon-nep5");

const neonJs = nep5Plugin(neonCore);

module.exports = neonJs;
```
