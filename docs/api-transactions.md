---
id: api-transactions
title: Transactions
---

The Transactions module is exposed as:

```js
import Neon from '@cityofzion/neon-js'
let transaction1 = Neon.create.claimTx(...args)
transaction1 = Neon.sign.transaction(transaction1, privateKey)
let serialized1 = Neon.serialize.tx(transaction1)
let txid1 = Neon.get.transactionHash(transaction1)

import { tx } from '@cityofzion/neon-js'
let transaction2 = tx.createClaimTx(...args)
transaction2 = tx.signTransaction(transaction2, privateKey)
let serialized2 = tx.serializeTransaction(transaction2)
let txid2 = tx.getTransactionHash(transaction2)
```

Transactions form the core of the interaction with the blockchain. In order to effect any state changes on the chain, a transaction is required to be sent and processed into a block by the consensus nodes.

## Classes

### Transaction

The Transaction class is a wrapper class that contains all the tools required to manipulate and build transactions. This allows us to dynamically add intents, remarks at will instead of cramming everything into a single method.

```js
import Neon from '@cityofzion/neon-js'
// Let us create a ContractTransaction
let tx = Neon.create.tx({type: 128})
// Now let us add an intention to send 1 NEO to someone
tx
.addOutput('NEO',1,someAddress)
.addRemark('I am sending 1 NEO to someAddress') // Add an remark
.calculate(balance) // Now we add in the balance we retrieve from an external API and calculate the required inputs.
.sign(privateKey) // Sign with the private key of the balance

const hash = tx.hash // Store the hash so we can use it to query a block explorer.

// Now we can use this serializedTx string and send it through sendrawtransaction RPC call.
const serializedTx = tx.serialize()
```

## Methods

### Components

Transactions are composed of the following parts:

1. Type

  This determines the transaction type. This determines how the transaction is serialized or deserialized. Currently, the library only support the following types:

  1. Contract
  2. Claim
  3. Invocation

2. Version

  This determines the version of the transaction. Protocol may defer for different versions.

3. Attribute

  Extra attributes that are attached to the transaction. An example is a Remark.

4. Input

  The inputs of the transaction. This is the assets being 'spent' by this transaction. System fees are also included here. Inputs are considered 'spent' after the transaction is processed.


5. Output

  The outputs of the transaction. This indicates the unspent assets created by this transaction. These outputs are 'unspent' and can be referenced as inputs in future transactions.

6. Witness

  The witnesses to the transaction. These are the signatures to authorise the transaction. Usually the private key of the owner of the input assets is used to generate the signature. Do note that although this component is named ``Witness``, its key in the Transaction object is ``scripts`` (we try to keep to the original names as described in the C# repo).

7. Exclusive Data (unique to each transaction type)

  Various data required for each transaction. For example, a ClaimTransaction will have the ``claims`` field which contains all claimable transactions. An InvocationTransaction will have the ``script`` field instead for smart contract invocation.

## Calculation Strategies

You may specify the calculation strategy used when calculating inputs. The strategy determines how inputs are chosen to meet the intents. For example, in a wallet with inputs of 1,2,3,4 and 5 NEO, there are many ways to fill an intent of 3 NEO. We can either fill it exactly with the 5 NEO input, or choose to use the smallest possible inputs so as to slowly consolidate our coins.

Currently, the only way to do that is to set the default strategy in settings.

There are 3 strategies to choose from. They are:

1. `balancedApproach`. This is the default strategy. It tried to find an single input that matches the entire output. Failing that, it chooses the largest possible input that fits within the output before filling the rest of the requirement. Taking the example above, we will choose the 3 NEO coin immediately as it fits the output exactly.

2. `largestFirst`. As the name suggests, the intent is filled starting with the largest input available. Here, we will choose the 5 NEO coin, constructing a change output of 2 NEO.

3. `smallestFirst`. We fill the intent starting with the smallest input available. We will choose the inputs 1 and 2 NEO to fill the intent fo 3 NEO.

```js
import {settings, tx} from '@cityofzion/neon-js'

settings.defaultCalculationStrategy = tx.calculationStrategy.smallestFirst
```

## Fees

Attaching fees is supported as the last argument in both creating transactions and also calculating. Fees work by having more GAS inputs than outputs. The difference between the inputs and the outputs are taken as fees. Fees first contribute towards system fees (eg. transaction costs, etc). Any excess will be considered as network fees and are used to prioritise transactions.

In the case of InvocationTransactions, the fees paid for running the smart contract is indicated by a separate field. So there are 3 fees available in InvocationTransactions: smart contract execution fees, system fees and network fees. Do note they are separate so any excess fees paid towards running the smart contract will not spill into system or network fees.

```js
import {tx} from '@cityofzion/neon-js'

// This attaches a fee of 1 GAS.
tx.Transaction.createContractTx(balances, intents, {}, 1)

// Another way is to attach fees on calculation
var newTx = new tx.Transaction()
newTx.addIntent({})
.calculate(balance, null, 1)

```
