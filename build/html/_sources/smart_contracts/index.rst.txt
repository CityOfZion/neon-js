**************
Smart Contract
**************

The Smart Contract module is exposed as::

  import Neon from 'neon-js'
  const sb = Neon.create.scriptBuilder()

  import {sc} from 'neon-js'
  const sb = new sc.scriptBuilder()

In NEO, users interact with smart contracts through InvocationTransactions. These transactions carry the hex output from scriptBuilder and assets involved to the network for processing.

To test out smart contracts, you are better off using RPC calls:

- invoke
- invokefunction
- invokescript

These are implemented in v2.3.3. These RPC calls execute the provided script and returns the result based on the current blockchain state. However, it is not actually recorded on the chain. Thus, their purpose is to test out the script to ensure validity and find out the gas cost required.

For example, in the NEP5 token standard, we do not require an actual transaction to retrieve the name or symbol of the token.

We will use a transaction when we want to effect a state change. For example, we want to transfer tokens from address A to B. We will use invoke to ensure the script is valid before sending the actual transaction.


Script Builder
==============
The Script Builder is an object that converts a smart contract method call into a hexstring that can be sent to the network with a InvocationTransaction.

::

  import Neon, {rpc} from 'neon-js'
  const sb = Neon.create.scriptBuilder()
  // Build script to call 'name' from contract at 5b7074e873973a6ed3708862f219a6fbf4d1c411
  sb.emitAppCall('5b7074e873973a6ed3708862f219a6fbf4d1c411', 'name')

  // Test the script with invokescript
  rpc.Query.invokeScript(sb.str).execute(nodeURL)

  // Create InvocationTransaction for real execution
  const tx = Neon.create.invocationTx(publicKey, {}, {},sb.str, 0)

You may chain multiple calls together. The results will be return in order.

::
  import Neon, {rpc} from 'neon-js'
  const sb = Neon.create.scriptBuilder()
  sb.emitAppCall(scriptHash, 'name')
  .emitAppCall(scriptHash, 'symbol')

  // Returns name, symbol
  rpc.Query.invokeScript(sb.str)
