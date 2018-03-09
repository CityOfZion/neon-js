---
id: changelog-latest
title: Changelog (v3)
---

3.3.2
=====

- Fixes

  - Update typescript typings
  - Use user provided parameters when given for api core methods
  - Fix ScriptBuilder to accept empty string and zero value
  - neonDB to use `get_all_nodes` endpoint instead of `best_node` endpoint
  - Fix neoscan `getMaxClaimAmount`, `getBalance` and `getClaims` for invalid addresses

3.3.0
=====

- API

  - Add support for manpulating smart contracts. This means that you can send assets from smart contracts. This support is currently enabled only in the core API methods `sendAsset` and `doInvoke`. **This is currently experimental and is subject to breaking changes without notice** (no minor version bump for changes to these).
  - Add support for `config.account`. You can now use Account in place of address and private key.
  - Add support for `config.balance`. You can use an old Balance object instead of retrieving a new one. Attaching a Balance object will cause the function to skip over the retrieval process.

- Wallet

  - Add `confirm` to Balance object.

- SC

  - Add ContractParam.hash160

- Util

  - Add `isHex` and `ensureHex` as ways to conveniently check format of hexstrings.

- Fixes

  - Add more logging messages throughout.
  - `api.signTx` now checks and converts the return value from external function to a Transaction object.
  - Fix regex string for `rpc.getVersion`.

3.2.1
=====

- Update typescript typings

3.2.0
=====

- Wallet

  - Implement encryptAsync and decryptAsync using a new scrypt library. Further work will be done to convert the existing encrypt/decrypt to use the new library.
  - Claims object is now slicable, allowing users to break up the Claims object into smaller Claims.

- Util

  - Override more methods in Fixed8 to return Fixed8s.
  - Update util functions to use Fixed8 internally.

- API

  - Mark `api.nep5.doTransferToken` for deprecation.

- Sc

  - createScript now accepts an array of scripts to parse and concatenate.

- Docs

  - Start to overhaul docs to favor examples and integrating the reference into the main docs instead of having it as a standalone section.

- Others

  - NPM packages updated to latest.

- Fixes

  - Fix scryptParams to use n,r,p
  - Update default RPC endpoints to use https
  - Fix Account defaults
  - Fix _emitNum emitting trimmed hex numbers

3.1.0
======

- API

  - Expose the `loadBalance` method. This method allows the use of the dynamic API switch within `neon-js` for the external providers.
  - Implement the full set of APIs on neoscan. Neoscan is now complete and up to par with neonDB in terms of features.
  - Expose `getXFrom` set of methods which follow the API config convention and is usable with the loadBalance function.

3.0.0
=====

- Logging

  - Setup logging directed at `stdout` and `stderr`. Logging package is loglevel.
  - Defaults to silent.
  - Not exposed through semantic style currently.
  - All deprecation messages are set to 'warn' level.
  - See logging for more details.

- Utils

  - Fixed8: A new class extending bignumber.js that replaces all value storage in neon-js
  - This class is now used for all classes that involves coin values with decimal places.
  - Comes with helper methods such as `toHex` and `fromHex`.

```js
import {u} from '@cityofzion/neon-js'
// accepts numbers or string
const num1 = new u.Fixed8(123.4567)
const num2 = u.Fixed8.fromHex('0000000005f5e100') // 1

const num3 = num1.add(num2) // immutable
console.log(num3.toString()) // '124.4567'
```

- Wallet

  - `Claims` is now a ES6 class. While it does not have any spceial methods for it now, it is one of the high level objects that we will be working with in `neon-js`. This allows easy creation of `Claims` using the constructor by passing in a CLaims-like javascript object.
  - `components` have been created for the minor sub-components found in `Claims` and `Balance`. These methods are useful for us to rapidly create components that are usable with `neon-js` methods. Refer to the wallet section for more information.
  - **BREAKING** Excess NEP2 functions are now fully deprecated. The list is `encryptWifAccount`, `generateENcryptedWif`, `encryptWIF`, `decryptWIF`.

- Transaction

  - Update all methods to conform with the new Fixed8 classes. This also means that `neon-js` will not be compatible with just normal javascript objects anymore.

- API

  - **BREAKING** Update external API libraries (neonDB and neoscan) to return `Balance` and `Claims` objects. Fixed8 will be used in the new models, making arithmetic operations very different from normal javascript numbers.
  - A bug has been discovered in `getPrice`. While it works for NEO and GAS, it will not work for any of the NEP5 tokens. `getPrices` has been fixed for this bug. However, there is no easy fix for `getPrice` and thus, we will move forward with deprecating `getPrice` in favor of `getPrices`.

- Fixes

  - fix getPrices by adding a limit=0 to the query.
  - fix default Account.contract field not having the required shape.
  - fix transaction attribute being deserialized wrongly.
