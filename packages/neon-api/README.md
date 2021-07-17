# neon-api

## Overview

Neon-API plugin. Provides the package `api` within `neon-js`.

- Provides high level functionality for crafting transactions.
- Provides API for accessing external data (neoscan) and notifications (neo-pubsub) providers.


## Installation

NPM:

```sh
npm install @cityofzion/neo-api
```

Yarn:

```sh
yarn add @cityofzion/neon-api
```

```js
const neonCore = require("@cityofzion/neon-core");
const apiPlugin = require("@cityofzion/neon-api");

const neonJs = apiPlugin(neonCore);

module.exports = neonJs;
```
