---
id: domain
title: neon-domain
---

The `domain` module is available as the plugin `@cityofzion/neon-domain`.

```js
import _Neon from "@cityofzion/neon-js";
import domainPlugin from "@cityofzion/neon-domain";

const Neon = domainPlugin(_Neon);

const provider = Neon.domain.nns.instance("NnsContractAddress");
const blockchainAddress = provider.resolveDomain(
  mainNetRpcUrl,
  "myaddress.neo"
);
```

The module's purpose is to integrate the common functionality of translating a human-readable address to a blockchain address.

This package is not included in `neon-js` by default. Consumers are required to include this package in by themselves.
