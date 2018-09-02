---
id: multisig
title: Advanced - Working with multi-sig contracts
---

In this guide, we will show how to create a multi-sig Account and sign a transaction with it.

A multi-sig Account can be identified by its verification script. It uses the `CHECKMULTISIG` OpCode (`ae` in hexstring). Thus, if you see any verification scripts ending with `ae`, it is likely to be a multi-sig Account.

## Creating a new multi-sig contract

In order to create a multi-sig contract, we need 2 things:

- Signing Threshold

  This is the minimum number of signatures required for this contract in order to verify a transaction. This number cannot be zero and cannot be larger than the number of public keys given.

- List of participating public keys.

  This is a list of all public keys that will be part of the contract. Due to the need for a public key, you cannot have a multi-sig contract participating as a member of another multi-sig contract.

Once the requirements are gathered, just called the function:

```js
import { wallet } from "@cityofzion/neon-js";

const threshold = 2;
const publicKeys = [
  "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef",
  "031d8e1630ce640966967bc6d95223d21f44304133003140c3b52004dc981349c9",
  "02232ce8d2e2063dce0451131851d47421bfc4fc1da4db116fca5302c0756462fa"
];
var multiSigAcct = wallet.Account.createMultiSig(threshold, publicKeys);

console.log(multiSigAcct.address) // ASo1RcNVLiV3yQ8j3ZyZv5EWfqBBT8s2Yd
```

Here, we create a multi-sig contract with 3 public keys and a signing threshold of 2. This means that any transaction with the intention of moving assets from `ASo1RcNVLiV3yQ8j3ZyZv5EWfqBBT8s2Yd` will require only 2 signatures from any of the 3 keys.

Do note that the order of public keys play an important factor in the generation of the address. A multi-sig contract with keys 1,2,3 is different from a contract with keys 3,2,1. You cannot change the order after creation. Similarly, the threshold cannot be adjusted after creation.

## Inspecting the Account

So now that you have created the multi-sig Account, we can take a look at the internals and know what is important.

```js
console.log(multiSigAcct.contract.script); // VerificationScript
```

**This is the most important part of this Account.** This is the verification script of the contract and it is paramount that you maintain a copy of this somewhere. Without this, the system will not be able to generate the multi-sig signature required.

```js
console.log(multiSigAcct.contract.parameters); // Parameters
```

This is the parameters of the verification script. This just tells us what is the signing threshold as the number of parameters is the number of signatures required. You can think of the verification script as a function and these are the required arguments to the function.

## Signing with multi-sig

In terms of transaction construction, there is no difference between a normal Account and a multi-sig Account so I shall skip that phase. The only difference lies in the signing. To sign using a multi-sig contract, you have to gather the signatures generated from the different public keys and transform them into a single Witness. We can perform the transformation using the function `Witness.buildMultiSig`.

We can go two ways here:

### Using hexstrings

We can perform every step in hexstrings. First we deserialize the transaction into a hexstring:

```js
// Let us call the transaction unsignedTx
const hex = unsignedTx.serialize();
```

Now, we send this hexstring to our respective owners of the public keys and request them to sign:

```js
const signature1 = wallet.sign(hex, privateKey1);
```

They will now send back the signatures. They should be just normal hexstrings of 64 characters long. Once we have collected enough signatures, we can assemble the witness:

```js
const witness = tx.Witness.buildMultiSig(
  hex,
  [signature1, signature2],
  verificationScript
);
unsignedTx.scripts.push(witness);
```

Now, your transaction is signed and ready to be transmitted to the network.

### Using objects

We can perform the steps using `neon-js` objects. We distribute the transaction and request the key holders to sign the transaction like how they will sign a normal transaction:

```js
const signedTx1 = unsignedTx.sign(account1);
const signedTx2 = unsignedTx.sign(account2);
```

Once all the signed transactions are transmitted back, we extract the individual signatures and compile them using `Witness.buildMultiSig`:

```js
const individualWitnesses = [signedTx1, signedTx2].map(t => t.scripts[0]);
const witness = tx.Witness.buildMultiSig(
  unsignedTx.serialize(),
  individualWitnesses,
  multiSigAcct
);

unsignedTx.scripts.push(witness);
```

Both methods should achieve the same results.

## Notes

- Order of public keys for creation matters but order of signatures for signing does not matter (because we order it within).
- There is no need to
