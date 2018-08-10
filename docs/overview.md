---
id: overview
title: Overview
---

`neon-js` is a Javascript library to interface with NEO blockchain, providing quick and easy methods to send RPC calls, create transactions and simple contract invocations.

## Features

- Built-in RPC queries
- Transaction creation, serialization and deserialization
- Wallet key manipulation
- Smart Contract script builder
- 3rd party API support

## Usage

Neon can be used in 2 ways:

### Semantic

The default import for Neon is a Javascript object where functions are arranged in a semantic manner following the convention of Verb-Noun. If a method goes beyond 2 levels, the rest of the name is camelCased at the noun level.

```js
import Neon from "@cityofzion/neon-js";
Neon.create.privateKey();
Neon.serialize.tx(transactionObj);
Neon.get.publicKeyFromPrivateKey(privateKey);
```

This style is recommended for beginners or anyone who just wishes to use Neon without hassle.

### Named

Named imports are the conventional JS imports. The modules in Neon are:

- `api`
- `CONST`
- `rpc`
- `sc`
- `tx`
- `u`
- `wallet`

```js
import { api } from "@cityofzion/neon-js";
```

This style offers more control and flexibility. Do refer to the source code for each module's exports.
