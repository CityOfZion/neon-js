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

Transaction
-----------

The Transaction class is a wrapper class that contains all the tools required to manipulate and build transactions. This allows us to dynamically add intents, remarks at will instead of cramming everything into a single method.

::

  import Neon from 'neon-js'
  // Let us create a ContractTransaction with a custom version
  let tx = Neon.create.tx({type: 128, version:2})
  // Now let us add an intention to send 1 NEO to someone
  tx
  .addOutput('NEO',1,someAddress)
  .addRemark('I am sending 1 NEO to someAddress') // Add an remark
  .calculate(balance) // Now we add in the balance we retrieve from an external API and calculate the required inputs.

  // Now we can use this serializedTx string and send it through sendrawtransaction RPC call.
  const serializedTx = tx.serialize()

Components
-----------

Transactions are composed of the following parts:

1. Type

  This determines the transaction type. This determines how the transaction is serialized or deserialized. Currently, the library only support the following types:

  1. Contract

  2. Claim

  3. Invocation

2. Version

  This determines the version of the transaction. Protocol may defer for different versions.

3. Attribute

.. autofunction:: TransactionAttribute

  Extra attributes that are attached to the transaction. An example is a Remark.

4. Input

.. autofunction:: TransactionInput

  The inputs of the transaction. This is the assets being 'spent' by this transaction. System fees are also included here. Inputs are considered 'spent' after the transaction is processed.


5. Output

.. autofunction:: TransactionOutput

  The outputs of the transaction. This indicates the unspent assets created by this transaction. These outputs are 'unspent' and can be referenced as inputs in future transactions.

6. Witness

.. autofunction:: Witness

  The witnesses to the transaction. These are the signatures to authorise the transaction. Usually the private key of the owner of the input assets is used to generate the signature. Do note that although this component is named ``Witness``, its key in the Transaction object is ``scripts`` (we try to keep to the original names as described in the C# repo).

7. Exclusive Data (unique to each transaction type)

  Various data required for each transaction. For example, a ClaimTransaction will have the ``claims`` field which contains all claimable transactions. An InvocationTransaction will have the ``script`` field instead for smart contract invocation.




Types
-----

.. toctree::
   :maxdepth: 1
   :caption: Contents:

   contract
   claim
   invocation
