.. neon-js documentation master file, created by
   sphinx-quickstart on Fri Oct 13 09:43:12 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

*******
neon-js
*******

neon-js is a JS library to interact with the NEO blockchain. It supports::

- Wallet methods such as key generation, manipulation and encryption.
- Transaction creation, serialization and deserialization.
- Smart contract calling for NEP-5.
- Various APIs needed to support a light wallet.

Quickstart
==========

Import the default module for full functionality available in a semantic form::

    import Neon from '@cityofzion/neon-js'

    const account = Neon.create.account('L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g')
    Neon.create.query({method: 'getrawtransaction', params: ['bfb3af8bc96ae3dd85305eddfe6e8b8eca447315729073f30da64f80c16f66ac']})
    .execute(Neon.CONST.DEFAULT_RPC.MAIN)
    .then((res) => {
      console.log(Neon.serialize.tx(res.result))
    })
    Neon.api.getBalance("TestNet", account.address).then((response) => {
      console.log(response)
    })

Use named imports for fine-grained control and tree-shaking::

    import { wallet, tx, rpc, api, CONST } from '@cityofzion/neon-js'

    const account = new wallet.Account('L1QqQJnpBwbsPGAuutuzPTac8piqvbR1HRjrY5qHup48TBCBFe4g')
    rpc.Query.getRawTransaction('bfb3af8bc96ae3dd85305eddfe6e8b8eca447315729073f30da64f80c16f66ac')
    .execute(CONST.DEFAULT_RPC.MAIN)
    .then((res) => {
      tx.serializeTransaction(res.result)
    })

    api.getBalance("TestNet", account.address).then((response) => {
      console.log(response)
    })

Format
------

This documentation is meant to serve as a high level explaination of the library. The layout of this docs will follow closely to the source code. You are highly encouraged to read the source code as it is also commented.

.. toctree::
    :maxdepth: 2
    :caption: Contents:

    overview
    installation
    interface
    wallet
    transactions/index.rst
    rpc/index.rst
    api/index.rst
    smart_contracts/index.rst
    utility
    constants
    reference/index.rst
    changelog
