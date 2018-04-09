---
id: changelog-latest
title: Changelog (v3)
---

3.6.1
=====

- Fixes

  - `wallet.decryptAsync` to properly reject all errors
  - fix `balancedApproach` calculation strategy to consider bigger coins when insufficient small coins
  - Fix typo in typings

3.6.0
=====

- Transaction

  - Add calculation strategies to modify how inputs are selected. Current available strategies are `smallestFirst`, `biggestFirst` and `balancedApproach`. Currently only available as a global setting.

  ```js
  import { tx, settings } from '@cityofzion/neon-js'

  // Change the strategy to use the biggest valued output available.
  settings.defaultCalculationStrategy = tx.calculationStrategy.biggestFirst
  // See all available strategies
  console.log(tx.calculationStrategy)
  ```

3.5.0
=====

- Wallet

  - Add scripthash support. `Account` now accepts scripthash as a constructor and `isScriptHash` is available as a verification method.

- SC

  - Add arguments for handling specific ContractParam transformation. The first one to do this is Fixed8 which takes a decimals argument which adjusts the number to the number of decimals given. This is useful for contracts that use decimals places other than 8.

3.4.5
=====

- Docs

  - Add 2 new guides around `doInvoke`

- Fixes

  - Fix script ordering for mintTokens
  - Remove `new` for Coin
  - Revert upgrade for bignumber.js
  - Fix typings and add typings check
  - Fix `ScriptBuilder._emitString` for large strings

3.4.0
=====

- Settings

  - There is now global settings that control how `neon-js` works.  The first settings available are `httpsOnly` and `networks`.

    - `httpsOnly` is a boolean which will force neonDB and neoscan to return only https RPC nodes. Do note that an error will be thrown if no suitable nodes are found.
    - `networks` is an object containing every network configuration available for consumption. It comes default with `MainNet`, `TestNet` and `CozNet`. For now, these configurations only determine the neonDB/neoscan urls used for each network but they will serve more purposes in the future.

- RPC

  - Network class representing a NEO network. This can be created by importing a protocol file or just manually entering the parameters. This is the new way which we can link `neon-js` to a private net that comes with a neoscan or neonDB setup.

- Smart Contract

  - ScriptBuilder.toScriptParams allows you to reverse engineer a VM script back to its arguments. Due to the varied nature of the arguments, it is not possible to reverse it completely. More work has to be done on the user side to parse it in a meaningful manner.

  ```js
  const sb = new sb.ScriptBuilder('00c1046e616d65675f0e5a86edd8e1f62b68d2b3f7c0a761fc5a67dc')
  const params = sb.toScriptParams()
  params = [{
        "scriptHash": "dc675afc61a7c0f7b3d2682bf6e1d8ed865a0e5f",
        "args": [
          "6e616d65", // 'name' in hexstring
          []
        ],
        "useTailCall": false
      }]
  ```

- Wallet

  - New methods added for signing and verifying messages: `signMessage`, `verifyMessage`

- Docs

  - Docs migrated to Docusaurus! This will make it easier to customize docs and also allow us to support Chinese as the alternative language.

- Development

  - Upgraded dependencies to use webpack v4 and the new babel exports from its monorepo.

- Fixes

  - Fix neonDB and neoscan `getTransactionHistory`. **Do note that this can be considered a breaking change for some as the return structure has changed. However, this is considered a fix as the original return structure was not intended.**
  - new Wallet to use default scrypt params when not provided.
  - Typescript typings refactored and cleaned up. Introduces the object-like interfaces which are the neon-js classes exported as plain javascript objects.

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
