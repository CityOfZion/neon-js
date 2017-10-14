.. neon-js documentation master file, created by
   sphinx-quickstart on Fri Oct 13 09:43:12 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

*******
neon-js
*******

This is neon-js

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

   light_wallet_api/index.rst
   rpc/index.rst
   transactions/index.rst
   smart_contracts/index.rst
