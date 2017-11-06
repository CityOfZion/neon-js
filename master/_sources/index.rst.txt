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

Import all as Neon::

    import * as Neon from 'neon-js'

    Neon.getBalance("TestNet", "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW").then((response) => {
      console.log(response)
    })

.. toctree::
   :maxdepth: 2
   :caption: Contents:

   wallet
   light_wallet_api/index.rst
   transactions/index.rst
   smart_contracts/index.rst
