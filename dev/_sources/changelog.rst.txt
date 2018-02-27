*********
Changelog
*********

This details the changes made from the previous recorded version.

3.3.2
=====

- Fixes

  - Update typescript typings
  - Use user provided parameters when given for api core methods
  - Fix ScriptBuilder to accept empty string and zero value
  - neonDB to use ``get_all_nodes`` endpoint instead of ``best_node`` endpoint
  - Fix neoscan ``getMaxClaimAmount``, ``getBalance`` and ``getClaims`` for invalid addresses

3.3.0
=====

- API

  - Add support for manpulating smart contracts. This means that you can send assets from smart contracts. This support is currently enabled only in the core API methods ``sendAsset`` and ``doInvoke``. **This is currently experimental and is subject to breaking changes without notice** (no minor version bump for changes to these).
  - Add support for ``config.account``. You can now use Account in place of address and private key.
  - Add support for ``config.balance``. You can use an old Balance object instead of retrieving a new one. Attaching a Balance object will cause the function to skip over the retrieval process.

- Wallet

  - Add ``confirm`` to Balance object.

- SC

  - Add ContractParam.hash160

- Util

  - Add ``isHex`` and ``ensureHex`` as ways to conveniently check format of hexstrings.

- Fixes

  - Add more logging messages throughout.
  - ``api.signTx`` now checks and converts the return value from external function to a Transaction object.
  - Fix regex string for ``rpc.getVersion``.

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

  - Mark ``api.nep5.doTransferToken`` for deprecation.

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

  - Expose the ``loadBalance`` method. This method allows the use of the dynamic API switch within ``neon-js`` for the external providers.
  - Implement the full set of APIs on neoscan. Neoscan is now complete and up to par with neonDB in terms of features.
  - Expose ``getXFrom`` set of methods which follow the API config convention and is usable with the loadBalance function.

3.0.0
=====

- Logging

  - Setup logging directed at ``stdout`` and ``stderr``. Logging package is loglevel.
  - Defaults to silent.
  - Not exposed through semantic style currently.
  - All deprecation messages are set to 'warn' level.
  - See logging for more details.

- Utils

  - Fixed8: A new class extending bignumber.js that replaces all value storage in neon-js
  - This class is now used for all classes that involves coin values with decimal places.
  - Comes with helper methods such as ``toHex`` and ``fromHex``.

  ::

    import {u} from '@cityofzion/neon-js'
    // accepts numbers or string
    const num1 = new u.Fixed8(123.4567)
    const num2 = u.Fixed8.fromHex('0000000005f5e100') // 1

    const num3 = num1.add(num2) // immutable
    console.log(num3.toString()) // '124.4567'

- Wallet

  - ``Claims`` is now a ES6 class. While it does not have any spceial methods for it now, it is one of the high level objects that we will be working with in ``neon-js``. This allows easy creation of ``Claims`` using the constructor by passing in a CLaims-like javascript object.
  - ``components`` have been created for the minor sub-components found in ``Claims`` and ``Balance``. These methods are useful for us to rapidly create components that are usable with ``neon-js`` methods. Refer to the wallet section for more information.
  - **BREAKING** Excess NEP2 functions are now fully deprecated. The list is ``encryptWifAccount``, ``generateENcryptedWif``, ``encryptWIF``, ``decryptWIF``.

- Transaction

  - Update all methods to conform with the new Fixed8 classes. This also means that ``neon-js`` will not be compatible with just normal javascript objects anymore.


- API

  - **BREAKING** Update external API libraries (neonDB and neoscan) to return ``Balance`` and ``Claims`` objects. Fixed8 will be used in the new models, making arithmetic operations very different from normal javascript numbers.
  - A bug has been discovered in ``getPrice``. While it works for NEO and GAS, it will not work for any of the NEP5 tokens. ``getPrices`` has been fixed for this bug. However, there is no easy fix for ``getPrice`` and thus, we will move forward with deprecating ``getPrice`` in favor of ``getPrices``.


- Fixes

  - fix getPrices by adding a limit=0 to the query.
  - fix default Account.contract field not having the required shape.
  - fix transaction attribute being deserialized wrongly.

2.x.x
=====

2.3.4
-----

- Docs moved to ``docs`` folder

- Fixes

  - push instead of unshift for ``api.attachInvokedContractForMintToken``.
  - getPrices patch.
  - update export name for ``TxAttrUsage``.
  - Fix transaction attribute deserialization.
  - Fix _emitNum emitting trimmed hex numbers.
  - clean neonDB input numbers
  - Fix ``TxAttrUsage`` not being imported properly.

2.3.0
-----

- Smart Contract

  - Add OpCodes ``APPEND`` and ``REVERSE``.

- API

  - Add ``getPrices`` to get multiple token prices with a single API call.
  - Update parsing of ``api/getToken`` to include case of empty string for parsing the ``decimals`` field.
  - Update ``doMintToken`` to include extra information required for future invokes.

    - This is in preparation of the upcoming changes for minting NEP5 tokens.

  - Implement the API switch.

    - This internal switch allows control over priority of API server.
    - Set to 0 for neoscan priority, 1 for neonDB priority. Setting it in the middle results in a random choice.
    - Switch will dynamically choose whichever server that respond better. A failure will start tilting the switch towards the other server. Freezing the switch will prevent this dynamic behavior.
    - This is currently not fully exposed but will be in the future.

    ::

      import {api} from '@cityofzion/neon-js'
      api.setApiSwitch(0)
      api.sendAsset(config) // sendAsset, claimGas and doInvoke will default to use neoscan first
      api.setApiSwitch(1)
      api.doInvoke(config) // This call will default to use neonDB first

      // This freezes the switch, preventing it from changing dynamically.
      // You still can change it with setApiSwitch.
      api.setSwitchFreeze(true)

- Fixes

  - Fix ``core.signTransaction`` to check if input is a HEX private key.
  - Fix NEP5 tokens to parse by ``decimals`` field.
  - Fix default values for invocation exclusive component.

- Others

  - Add docs build information to readme.

2.2.2
-----

- Fix ``nep5/doTransferToken``

2.2.1
-----

-Fix ``fixed82num`` not accepting empty string

2.2.0
-----

- Wallet

  - Implementation of NEP-6 standard as ``wallet.Wallet``
  - Move NEP2 constants to CONST
  - encrypt/decrypt has an extra optional scrypt argument
  - Deprecate wallet.encryptWifAccount, wallet.generateEncryptedWif, wallet.encryptWIF, wallet.decryptWIF

  ::

    import Neon, {wallet} from '@cityofzion/neon-js'
    const w1 = Neon.create.wallet()
    const w2 = new wallet.Wallet()

- Account

  - Add label and extra to Account
  - Add functions encrypt and decrypt to Account

- Transaction

  - Transaction creation will now move coins used from ``unspent`` to ``spent`` and add the new coins in ``unconfirmed``.
  - ``api.sendTx`` now moves coins from ``unconfirmed`` to ``unspent``.
  - This means that we can create 2 transactions in a single block without blocking each other. Previously, the 2 transactions will attempt to use the same coins.

- API

  - Add ``api.getToken`` which is a combination of ``api.getTokenInfo`` and ``api.getTokenBalance``, allowing for simple info retrieval within a single call. This is exposed semantically as ``Neon.get.token``.
  - Bugfix CoinMarketCap truncating prices to integers.
  - Bugfix doTransferToken sending gas to wrong address and appending wrong item to txid when successful (was appending the full tx instead).
  - Catch getTokenBalance error when using an address with no balance.

- RPC

  - Add ``VMZip`` method. This allows for individual parsing of VM results. Do note that this method produces a parsing function. It is not to be used directly.

  ::

    import {rpc, u} from '@cityofzion/neon-js'
    const parsingFunc = rpc.VMZip(u.hexstring2ab, u.fixed82num)
    rpc.Query.invoke(script).parseWith(parsingFunc)

- Utils

  - Add ``hexstring2str`` method.

2.1.0
-----

- Balance as an ES6 class.

  - ``verifyAssets`` to validate unspent coins against a given NEO node. Used to check if balance is fully synced and usable.
  - ``applyTx`` to apply a spending of a Transaction to the Balance. Allows a Balance to be used to build another Transaction without waiting for sync.
  - Data structure reworked. AssetBalances are now tucked under ``assets``. Use ``assetSymbols`` to discover the keys for lookup.

  ::

    // This array contains all the symbols of the assets available in this Balance
    balance.assetSymbols = ['NEO', 'GAS']
    // Lookup assets using their symbols
    balance.assets = {
      NEO: {balance: 1, unspent: [ Object ], spent: [], unconfirmed: []}
      GAS: {balance: 25.1, unspent: [ Object ], spent: [], unconfirmed: []}
    }

- Added ``doTransferToken`` to ``api/nep5``
- Unit tests for ``utils``
- Typescript typings fixed

2.0.0
-----

- Package exports semantic style

  - Default export is now a semantic object that follows the convention of Verb-Noun.
  - Verbs available are : ``get``, ``create``, ``serialize``, ``deserialize``, ``is``. Read the ``index.js`` file of each module to know what they export.
  - Modules are individually available as named exports. If you just need account methods, ``import { wallet } from '@cityofzion/neon-js'``

- Constants and util methods are now exported as

  ::

    import Neon from '@cityofzion/neon-js'
    Neon.CONST.DEFAULT_RPC
    Neon.u.reverseHex

    import { CONST, u } from '@cityofzion/neon-js'
    CONST.DEFAULT_RPC
    u.reverseHex

- Wallet

  - Account is now available as a class instead of a JS object. Account is now the recommended way to manage keys.
  - Removed ``getAccountFromWIFKey`` and ``getAccountFromPrivateKey``
  - Key manipulation methods streamlined to the minimum. No more ``getAddressFromPrivateKey``.  Methods now only transform the key one level.
  - Key verification methods fully implemented for every possible key format. Follows convention of ``isKeyFormat``.

- Transaction

  - Transaction is now an ES6 class instead of a JS object. Transaction is now the recommended way to construct and manipulate transactions.
  - Refactor methods to utilise the new Transaction class.
  - Removed ``publicKey`` argument from create Transaction methods as address is sufficient for generating scriptHash.
  - Add human-friendly method for creating TransactionOutput.
  - Ability to add a remark to Transaction through ``addRemark``

- RPC

  - RPCClient class models a NEO Node. Instantiate with ``Neon.create.rpcClient(url)``. Comes with built-in methods for RPC calls.
  - Query class models a RPC call. Instantiate with ``Neon.create.query()``. Comes with built-in methods for RPC calls.

- API

  - neon-wallet-db API is shifted to ``api`` folder.
  - Added coinmarketcap query support for easy price queries.
  - Token query (NEP5) is shifted here.
  - Neoscan support added.
  - Hardware support integrated as external signingFunction provided as argument.
  - New core api methods: sendAsset, claimGas and doInvoke.

- SC

  - ``generateDeployScript`` in ``sc`` is a wrapper for generating a deploy script.
  - ContractParam added to support ``invoke`` and ``invokefunction`` RPC calls.


1.x.x
=====

1.1.1
-----

- Ledger support

  - Add ability to sign using external function for neonDB API.
  - Bugfix for _emitNum

1.1.0
-----

- Transaction Overhaul

  - Transactions are now exposed semantically with the convention of Verb-Noun.
  - Transaction creation is exposed as ``create.claim``, ``create.contract`` and ``create.invocation``
  - Transactions can be serialized or deserialzed using ``serializeTransaction`` and ``deserializeTransaction``
  - Transaction signing is now ``signTransaction`` and it returns the signed transaction instead of having to manually attach the signature.
  - Transaction Hash can be calculated using ``getTransactionHash`` passing in the transaction object.

- ScriptBuilder for Smart Contract invocation

  - ScriptBuilder class is an object used to build VM scripts that mirrors the ScriptBuilder found in the C# repo.
  - ``buildScript`` is a convenient wrapper around ScriptBuilder to call a contract with ``operation`` accepting ``args``.

- getAccount methods renamed to getAccount and returns a single Account object instead of an array

  | getAccountsFromWIFKey -> getAccountFromWIFKey
  | getAccountsFromPrivateKey -> getAccountFromPrivateKey

1.0.4
-----

- Additional NEP2 wrapper methods (Simple encrypted WIF creation)
- Address validation to guard against sending to non-NEO addresses.

1.0.2
-----

- Introduce NEP2 Support (encrypt / decrypt WIF)

1.0.1
-----

- Upgrade API support to v2 for neon-wallet-db
