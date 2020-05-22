---
id: latest
title: Changelog (v5)
---

# 5.0.0

## Preview2:

```
neo-cli: v3.0.0-preview2
neon-js: v5.0.0-next3
```

Key blockchain changes:

- Change of address prefix. Now all addresses produced will start with `N`.
- Total revamp of OpCode and InteropServiceCode. All previous scripts are
  invalid.
- Signing of transaction now involves the magic number of the network. This
  makes transaction witnesses unique across the different networks (You cannot
  take a transaction from MainNet and replay it on TestNet. This was possible
  when UTXO was removed.)
-

SDK changes:

Due to the large number of changes ongoing, only `neon-core` will be fully
functional and maintained.

- Misc

  - Establish testing for Node 10 and Node 12.
  -

- tx

  - Renamed `scripts` field to `witnesses` field
  - `Transaction.sign` now takes an optional magic number argument to sign.
  - Add support for reading JSON outputs from neo RPC endpoints.
  -

- sc

  - `OpCode` is now an int enum (previously string)
  - `ScriptBuilder.emitString` now accepts a UTF8 string instead of hexstring.
    Please use `emitHexstring` for hex. This makes the distinction when emitting
    strings clearer.
  - Make public the various methods on ScriptBuilder for emitting different data
    types. Please avoid `emitPush` as it is too overloaded and may cause
    unexpected consequences.
  - Add a `ScriptBuilder.build` function to return a copy of the script
    (replaces the `.str` getter)

- rpc

  - Update methods to match preview2 methods. This removes getBlockSysFee. The
    rest received some data structure changes.
  - Optional verbose paramters now accepts booleans.
  - Amend getVersion to read the keys correctly.

- wallet

  - Account generation now uses the new address prefix of `0x35`.
  - Witness generation is updated to use the new OpCodes.
  - VerificationScript generation is also updated to match preview2.

* u

  - Add support for encoding and decoding between hexstrings and base64. This is
    used to send data over RPC.

## Preview1:

```
neo-cli: v3.0.0-preview1
neon-js: v5.0.0-next2
```

Key blockchain changes:

- Removal of the UTXO system coupled with the integration of additional RPC
  methods on the neo node allowed for the wallet to operate without the need for
  a third party aggregator. Neon-api is now a high level API package.

- A change in the neoVM and the generation of scripts means a change in
  addresses. Private and public keys are the only things that remain unchanged
  from neo2. All other details (Scripthash, WIF, NEP2, Address) are different.

SDK changes:

- Neon-api

  - Removed all provider modules. We do not need to rely on neoscan for details
    in order to form transactions.
  - Introduced a new flow for transaction forming. Old flow is removed.
    - TransactionBuilder class for forming transactions. This follows the
      builder fluent pattern allowing chaining of methods to add data to the
      transaction. Most of the more friendly methods will be found on this class
      with the old methods migrating off the Transaction class.
    - TransactionValidator is a new step in the process. It helps validate the
      properties of the transaction by making rpc calls to the blockchain and
      making sure that the parameters are valid. It also provides suggestions
      whenever possible.
    - TransactionSigner is a basic class for signing the Transaction. This will
      replace the `sign` function on the Transaction class itself.

- Neon-core

  - tx

    - There is only one Transaction type now.
    - Added new fields:
      - nonce: Field to make transaction unique since there is no more UTXO.
      - validUntilBlock: expiry date for transactions in mempool.
      - systemFee and networkFee: Separate fields for each fee.
      - sender: Identity of the main signature.
      - cosigners: Identities of other parties involved. Comes with
        permissioning for contract calls.
    - Replaced `AddAttribute` method. It now only accepts an
      TransactionAttributeLike object. Old method is now on the builder.

  - sc

    - There is now OpCode and InteropCodes. OpCode are your basic computer
      instructions while InteropCodes are for more complex operations. Signature
      verification code is moved from OpCode to InteropCode. (This is the
      primary change that resulted in the change in addresses)
    - Add ScriptParser class to read script back into ScriptIntent.
    - Add ContractManifest class.

  - tx

    - Updated Account to generate the new scripthash.

  - u

    - Add Hexstring class to handle hexstrings. Capable of handling strings
      starting with `0x` prefix.

- Neon-js

  - Updated networks to connect to neo3 TestNet.
