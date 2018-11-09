---
id: nep9
title: NEP9
---

The `nep9` module is available as the plugin `@cityofzion/neon-nep9`.

```js
import _Neon from "@cityofzion/neon-js";
import nep9Plugin from "@cityofzion/neon-nep9";

const Neon = nep9Plugin(_Neon);

const intent = Neon.nep9.parse("neo:AeNkbJdiMx49kBStQdDih7BzfDwyTNVRfb?asset=gas&amount=123.456");

console.log(intent);

```

The NEP9 Standard describes a simple protocol to represent a partial transaction as a URI.

This package deals with the decoding of the URI into an intent object that is then usable the neon-js system.

This package is not included in `neon-js` by default. Consumers are required to include this package in by themselves.

A QR code reader is not included in this package.

URI generation is not included in this package.
