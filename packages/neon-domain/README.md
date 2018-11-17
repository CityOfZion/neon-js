# neon-domain

## Overview

Neon-Domain plugin. Provides the package `domain` within `neon-js`.

- Provides functionality to resolve domain names to addresses.

## Installation

```sh
yarn i @cityofzion/neon-domain
```

```js
const neonCore = require("@cityofzion/neon-core");
const domainPlugin = require("@cityofzion/neon-api");

const neonJs = domainPlugin(neonCore);

module.exports = neonJs;
```
