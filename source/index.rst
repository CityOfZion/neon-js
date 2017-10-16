.. neon-js documentation master file, created by
   sphinx-quickstart on Fri Oct 13 09:43:12 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

*******
neon-js
*******

neon-js is a Javascript library to interface with NEO blockchain.


Quickstart
==========

This is a placeholder::


    import * as Neon from 'neon-js'

    Neon.getBalance("TestNet", "ALq7AWrhAueN6mJNqk6FHJjnsEoPRytLdW").then((response) => {
      console.log(response)
    })

.. toctree::
    :maxdepth: 2
    :caption: Contents:

    overview
    installation
    wallet
    transactions/index.rst
    rpc/index.rst
    light_wallet_api/index.rst
    smart_contracts/index.rst
