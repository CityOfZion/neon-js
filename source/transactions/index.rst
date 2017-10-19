************
Transactions
************

The Transactions module is exposed as::

  import Neon from 'neon-js'
  let transaction1 = Neon.create.claimTx(...args)
  transaction1 = Neon.sign.transaction(transaction1, privateKey)
  let serialized1 = Neon.serialize.tx(transaction1)
  let txid1 = Neon.get.transactionHash(transaction1)

  import {tx} from 'neon-js'
  let transaction2 = tx.createClaimTx(...args)
  transaction2 = tx.signTransaction(transaction2, privateKey)
  let serialized2 = tx.serializeTransaction(transaction2)
  let txid2 = tx.getTransactionHash(transaction2)

Transactions form the core of the interaction with the blockchain. In order to effect any state changes on the chain, a transaction is required to be sent and processed into a block by the consensus nodes.

Transactions are composed of the following parts:

1. Type

  This determines the transaction type. This determines how the transaction is serialized or deserialized.

2. Version

  This determines the version of the transaction. Protocol may defer for different versions.

3. Attribute

  Extra attributes that are attached to the transaction. An example is a Remark.

4. Input

  The inputs of the transaction. This is the assets being 'spent' by this transaction. System fees are also included here.

5. Output

  The outputs of the transaction. This indicates the unspent assets created by this transaction. These outputs are to be referenced in future transactions as their inputs.

6. Witness

  The witnesses to the transaction. These are the signatures to authorise the transaction. Usually the private key of the owner of the input assets is used to generate the signature.

7. Exclusive Data (unique to each transaction type)

  Various data required for each transaction. For example, a ClaimTransaction will have the ``claims`` field which contains all claimable transactions. An InvocationTransaction will have the ``script`` field instead for smart contract invocation.

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   contract.rst
   claim.rst
   invoke.rst
