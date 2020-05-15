# neon-ledger

## Overview

Neon-Ledger plugin. Provides the package `ledger` within `neon-js`.

- Wrapper for interacting with Ledger.

## Installation

```sh
yarn i @cityofzion/neon-node-ledger
```

```js
const neonCore = require("@cityofzion/neon-core");
const ledgerPlugin = require("@cityofzion/neon-ledger");

const neonJs = ledgerPlugin(neonCore);

module.exports = neonJs;
```

This package only provides an easy wrapper for communicating with the Ledger. You will need one of the ledger libraries depending on your use-case:

- `@ledgerhq/hw-transport-node-hid` (NodeJs)
- `@ledgerhq/hw-transport-u2f` (Browser)

You will need the library to instantiate the Ledger instance. After that, most of the methods can run off the Ledger instance.

Please refer to `test.node.js` for an example.

## API

### BIP44

This helper method returns the BIP44 hexstring. The arguments are reversed as the most common use case is to change the address as opposed to the others. All arguments default to zero for easy usage.

```js
const bipString = NeonJs.ledger.BIP44(1);
```

### getDevicePaths

This returns a list of paths where each path represents a Ledger device. The consumer is required to instantiate the Ledger instance by calling `open` on the Ledger library with the selected path.

If Ledger is not support on this device, an error will be thrown.

```js
import * as LedgerLibrary from "@ledgerhq/hw-transport-node-hid";
const paths = await neonJs.ledger.getDevicePaths(LedgerLibrary);
const ledgerInstance = LedgerLibrary.open(paths[0]);
```

### getPublicKey

This method retrieves the unencoded public key from the ledger.

```js
const publicKey = await neonJs.ledger.getPublicKey(ledgerInstance, bipString);
```

### getSignature

Returns the signature as a 64 bit hexstring. You will need some assembling of the witness from the signature.

```js
const signature = await neonJs.ledger.getSignature(
  ledgerInstance,
  tx,
  bipString
);
```
