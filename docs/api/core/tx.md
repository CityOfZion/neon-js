---
id: tx
title: Transactions
---

The `tx` module is exposed as:

```ts
import { tx, wallet } from "@cityofzion/neon-js";
const acct = new wallet.Account();
const transaction = new tx.Transaction();
transaction.addSigner(new tx.Signer({ account: acct.scriptHash }));
transaction.sign(acct);
console.log(transaction.hash());
```

Transactions form the core of the interaction with the blockchain. In order to
effect any state changes on the chain, a transaction is required to be sent and
processed into a block by the consensus nodes.

```js
// We can use this serializedTx string and send it through sendrawtransaction RPC call.
const serializedTx = transaction.serialize();
```

For deserialization, we have the `Transaction` static class:

```js
const transaction = tx.Transaction.deserialize(hexstring);
console.log(transaction instanceof tx.Transaction); // true
```

---

## Components

Transactions are composed of the following parts:

1. Version

This determines the version of the transaction. Protocol may defer for different
versions.

2. Witnesses

The witnesses to the transaction. These are the signatures to authorise the
transaction. Usually the private key of the owner of the input assets is used to
generate the signature.

3. Signers

The signers control the validity of the signatures and can be checked in smart contracts using the `CheckWitness`
functionality. A good article on how they work and can be used can be read here https://neospcc.medium.com/thou-shalt-check-their-witnesses-485d2bf8375d
The first signer is also known as the `sender` and will pay for the transaction fees.

4. Attributes

Extra attributes that are attached to the transaction. An example is a OracleResponse.
Attributes can only be set by special entities in the system (being the consensus committee or an Oracle node).
