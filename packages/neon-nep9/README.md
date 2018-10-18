# neon-nep9

## Overview

Neon-NEP9 plugin. Adds the package `nep9` into `neon-core`.

- Ability to parse an NEP9 compliant string into an easily consumable intent object

## Installation

```sh
yarn i @cityofzion/neon-nep9 @cityofzion/neon-core
```

```js
const neonCore = require("@cityofzion/neon-core");
const nep9Plugin = require("@cityofzion/neon-nep9");

const neonJs = nep9Plugin(neonCore);

module.exports = neonJs;
```

## API

`parse` takes in a complete NEP9 URI string and returns an intent object:

```js
import { nep9 } from "neonJs";
const intent = parse(
  "neo:AeNkbJdiMx49kBStQdDih7BzfDwyTNVRfb?asset=gas&amount=123.456"
);
```

The intent will look like:

```js
{
  address: "AeNkbJdiMx49kBStQdDih7BzfDwyTNVRfb",
  attributes:[], // defaults to empty array
  asset: "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7", // May be undefined
  amount: 123.456 // May be undefined
}
```

- Known ASCII attributes (remarks and descriptions) are URI-decoded and transformed into hexstrings automatically.
- Assets `neo` and `gas` are automatically transformed into their respective assetIds.
- Runtime validation such as address and contract verifications are not performed during parsing.
