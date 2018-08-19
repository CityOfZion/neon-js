---
id: index
title: API
---

`neon-js` is laid out in a modules style, with each folder in the source code representing a module with a particular functionality.

## default

The default import for Neon is a Javascript object where functions are arranged in a semantic manner following the convention of Verb-Noun. If a method goes beyond 2 levels, the rest of the name is camelCased at the noun level.

```js
import Neon from '@cityofzion/neon-js'
Neon.create.privateKey()
Neon.serialize.tx(transactionObj)
Neon.get.publicKeyFromPrivateKey(privateKey)
```

This style is recommended for beginners or anyone who just wishes to use Neon without hassle.

## api

The `api` module contains code that interfaces with external APIs as well as providing a high level abstraction.

## wallet

The `wallet` module deals with key manipulating as well as importing and exporting of wallet files.

## tx

The `tx` module deals with transaction creation, serialization and deserialization.

## sc

The `sc` module deals with smart contract script construction. It is used primarily to construct scripts that can be carried by InvocationTransaction.

## rpc

The `rpc` module deals with the RPC interface exposed by the NEO node.

## u

The `u` module is the utilities module containing methods handling the various data transformation aspects within NEO.

## CONST

The `CONST` module is a collection of constants and defaults used across all modules.
