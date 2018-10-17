# neon-nns

## Overview

Neon-NNS plugin. Provides the package `nns` within `neon-js`.

- Domain name to address resolution

## Installation

```sh
yarn i @cityofzion/neon-nns @cityofzion/neon-core
```

```js
const neonCore = require("@cityofzion/neon-core");
const nnsPlugin = require("@cityofzion/neon-nns");

const neonJs = nnsPlugin(neonCore);

module.exports = neonJs;
```
