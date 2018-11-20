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
const domainPlugin = require("@cityofzion/neon-domain");

const neonJs = domainPlugin(neonCore);

module.exports = neonJs;
```

## API

In order to use the resolver, you must first create an instance of it using the scripthash:

```js
const provider = neonJs.domain.nns.instance(contractScriptHash);
```

The resolver interface is defined in `provider/common.ts`.

You can resolve a domain by providing a rpc node url and the domain:

```js
const blockchainAddress = provider.resolveDomain(rpcUrl, "myaddress.neo");
```
