---
id: latest
title: Changelog (v5)
---

5.0.0
=====

Key blockchain changes:

- Removal of the UTXO system coupled with the integration of additional RPC methods on the neo node allowed for the wallet to operate without the need for a third party aggregator. Neon-api is now a high level API package.

- A change in the neoVM and the generation of scripts means a change in addresses. Private and public keys are the only things that remain unchanged from neo2. All other details (Scripthash, WIF, NEP2, Address) are different.


SDK changes:

- Neon-api

  - Removed all provider modules. We do not need to rely on neoscan for details in order to form transactions.
  - Introduced a new flow for transaction forming. Old flow is removed.
    - TransactionBuilder class for forming transactions. This follows the builder fluent pattern allowing chaining of methods to add data to the transaction. Most of the more friendly methods will be found on this class with the old methods migrating off the Transaction class.
    - TransactionValidator is a new step in the process. It helps validate the properties of the transaction by making rpc calls to the blockchain and making sure that the parameters are valid. It also provides suggestions whenever possible.
    - TransactionSigner is a basic class for signing the Transaction. This will replace the `sign` function on the Transaction class itself.

- Neon-core

  - tx

    - There is only one Transaction type now.
    - Added new fields:
      - nonce: Field to make transaction unique since there is no more UTXO.
      - validUntilBlock: expiry date for transactions in mempool.
      - systemFee and networkFee: Separate fields for each fee.
      - sender: Identity of the main signature.
      - cosigners: Identities of other parties involved. Comes with permissioning for contract calls.
    - Replaced `AddAttribute` method. It now only accepts an TransactionAttributeLike object. Old method is now on the builder.

  - sc

    - There is now OpCode and InteropCodes. OpCode are your basic computer instructions while InteropCodes are for more complex operations. Signature verification code is moved from OpCode to InteropCode.  (This is the primary change that resulted in the change in addresses)
    - Add ScriptParser class to read script back into ScriptIntent.
    - Add ContractManifest class.

  - tx

    - Updated Account to generate the new scripthash.

  - u

    - Add Hexstring class to handle hexstrings. Capable of handling strings starting with `0x` prefix.

- Neon-js

  - Updated networks to connect to neo3 TestNet.
