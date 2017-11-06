**************
Smart Contract
**************

We can call smart contracts through the RPC endpoint using an InvocationTransaction. The transaction carries the script which is read and executed by the VM contained within the NEO node.

As of 2.3.3, NEO nodes have implemented several RPC functions for testing out smart contract calls. These functions can be used to execute a VM script, returning the results as if it was executed on the blockchain itself. This is useful for developers to test and find out actual gas costs and find bugs.

The NEP-5 standard describes the token standard within the NEO ecosystem. To those coming from Ethereum, this is akin to the ERC20 token standard.

The Neon API exposes 2 methods for NEP-5::

  import * as Neon from 'neon-js'
  // Returns name, symbol and total supply
  Neon.getTokenInfo(net, scriptHash)
  // Returns amount of specific token owned by address.
  Neon.getTokenBalance(net, scriptHash, address)



.. toctree::
   :maxdepth: 1
   :caption: Contents:
